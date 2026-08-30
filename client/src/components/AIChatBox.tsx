import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Loader2, Send, User, Sparkles, MessageCircle, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import { mergeDictationText } from "@shared/voiceDictation";

/**
 * Message type matching server-side LLM Message interface
 */
export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = { [index: number]: SpeechRecognitionAlternativeLike; length: number; isFinal?: boolean };
type SpeechRecognitionEventLike = Event & { resultIndex: number; results: { [index: number]: SpeechRecognitionResultLike; length: number } };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

type DictationStatus = "idle" | "recording" | "unsupported" | "error";

export type AIChatBoxProps = {
  /**
   * Messages array to display in the chat.
   * Should match the format used by invokeLLM on the server.
   */
  messages: Message[];

  /**
   * Callback when user sends a message.
   * Typically you'll call a tRPC mutation here to invoke the LLM.
   */
  onSendMessage: (content: string) => void;

  /**
   * Whether the AI is currently generating a response
   */
  isLoading?: boolean;

  /**
   * Placeholder text for the input field
   */
  placeholder?: string;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Height of the chat box (default: 600px)
   */
  height?: string | number;

  /**
   * Empty state message to display when no messages
   */
  emptyStateMessage?: string;

  /**
   * Suggested prompts to display in empty state
   * Click to send directly
   */
  suggestedPrompts?: string[];

  /** Whether to render the component's own header. */
  showHeader?: boolean;
};

/**
 * A ready-to-use AI chat box component that integrates with the LLM system.
 *
 * Features:
 * - Matches server-side Message interface for seamless integration
 * - Markdown rendering with Streamdown
 * - Auto-scrolls to latest message
 * - Loading states
 * - Uses global theme colors from index.css
 *
 * @example
 * ```tsx
 * const ChatPage = () => {
 *   const [messages, setMessages] = useState<Message[]>([
 *     { role: "system", content: "You are a helpful assistant." }
 *   ]);
 *
 *   const chatMutation = trpc.ai.chat.useMutation({
 *     onSuccess: (response) => {
 *       // Assuming your tRPC endpoint returns the AI response as a string
 *       setMessages(prev => [...prev, {
 *         role: "assistant",
 *         content: response
 *       }]);
 *     },
 *     onError: (error) => {
 *       console.error("Chat error:", error);
 *       // Optionally show error message to user
 *     }
 *   });
 *
 *   const handleSend = (content: string) => {
 *     const newMessages = [...messages, { role: "user", content }];
 *     setMessages(newMessages);
 *     chatMutation.mutate({ messages: newMessages });
 *   };
 *
 *   return (
 *     <AIChatBox
 *       messages={messages}
 *       onSendMessage={handleSend}
 *       isLoading={chatMutation.isPending}
 *       suggestedPrompts={[
 *         "Explain quantum computing",
 *         "Write a hello world in Python"
 *       ]}
 *     />
 *   );
 * };
 * ```
 */
export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  className,
  height = "600px",
  emptyStateMessage = "Start a conversation with AI",
  suggestedPrompts,
  showHeader = true,
}: AIChatBoxProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const initialInputRef = useRef("");
  const [dictationStatus, setDictationStatus] = useState<DictationStatus>("idle");

  // Filter out system messages
  const displayMessages = messages.filter((msg) => msg.role !== "system");

  // Calculate min-height for last assistant message to push user message to top
  const [minHeightForLastMessage, setMinHeightForLastMessage] = useState(0);

  useEffect(() => {
    if (containerRef.current && inputAreaRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const inputHeight = inputAreaRef.current.offsetHeight;
      const scrollAreaHeight = containerHeight - inputHeight;

      // Reserve space for:
      // - padding (p-4 = 32px top+bottom)
      // - user message: 40px (item height) + 16px (margin-top from space-y-4) = 56px
      // Note: margin-bottom is not counted because it naturally pushes the assistant message down
      const userMessageReservedHeight = 56;
      const calculatedHeight = scrollAreaHeight - 32 - userMessageReservedHeight;

      setMinHeightForLastMessage(Math.max(0, calculatedHeight));
    }
  }, []);

  // Scroll to bottom helper function with smooth animation
  const scrollToBottom = () => {
    const viewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    ) as HTMLDivElement;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  const stopDictation = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setDictationStatus("idle");
  };

  const startDictation = () => {
    if (dictationStatus === "recording") {
      stopDictation();
      return;
    }

    if (typeof window === "undefined") return;
    const speechWindow = window as SpeechRecognitionWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setDictationStatus("unsupported");
      return;
    }

    try {
      const recognition = new Recognition();
      initialInputRef.current = input.trim();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || "en-US";
      recognition.onresult = event => {
        const transcript = Array.from({ length: event.results.length }, (_, index) => event.results[index]?.[0]?.transcript ?? "").join(" ").trim();
        setInput(mergeDictationText(initialInputRef.current, transcript));
      };
      recognition.onerror = () => setDictationStatus("error");
      recognition.onend = () => {
        recognitionRef.current = null;
        setDictationStatus(current => current === "recording" ? "idle" : current);
      };
      recognitionRef.current = recognition;
      setDictationStatus("recording");
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setDictationStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || dictationStatus === "recording") return;

    onSendMessage(trimmedInput);
    setInput("");

    // Scroll immediately after sending
    scrollToBottom();

    // Keep focus on input
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "chat-board whatsapp-chat flex flex-col overflow-hidden rounded-[24px] border bg-card text-card-foreground shadow-[0_20px_60px_rgba(2,8,23,0.14)]",
        className
      )}
      style={{ height }}
    >
      {showHeader && <div className="flex items-center justify-between gap-4 border-b border-border/70 bg-background/35 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MessageCircle className="size-4" /></div>
          <div><p className="text-sm font-semibold tracking-tight">BITC Chat with Thabo</p><p className="mt-0.5 text-[11px] text-muted-foreground">Public conversation</p></div>
        </div>
        <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300 sm:inline-flex">Ready to help</span>
      </div>}

      {/* Messages Area */}
      <div ref={scrollAreaRef} className="flex-1 overflow-hidden bg-[#efeae2] dark:bg-[#0b141a]">
        {displayMessages.length === 0 ? (
          <div className="flex h-full flex-col bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.36),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.2),transparent_18%)] p-4 dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.025),transparent_18%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.02),transparent_18%)]">
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="size-12 opacity-20" />
                <p className="text-sm">{emptyStateMessage}</p>
              </div>

              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => onSendMessage(prompt)}
                      disabled={isLoading}
                      className="rounded-2xl border border-border/80 bg-card/80 px-4 py-2.5 text-left text-xs font-medium leading-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col space-y-4 p-4">
              {displayMessages.map((message, index) => {
                // Apply min-height to last message only if NOT loading (when loading, the loading indicator gets it)
                const isLastMessage = index === displayMessages.length - 1;
                const shouldApplyMinHeight =
                  isLastMessage && !isLoading && minHeightForLastMessage > 0;

                return (
                                      <div
                      key={index}

                    className={cn(
                      "flex gap-3 items-end",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                    style={
                      shouldApplyMinHeight
                        ? { minHeight: `${minHeightForLastMessage}px` }
                        : undefined
                    }
                  >
                    {message.role === "assistant" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-4 text-primary" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "relative max-w-[82%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[76%]",
                        message.role === "user"
                          ? "rounded-tr-sm bg-[#d9fdd3] text-slate-900 dark:bg-[#005c4b] dark:text-slate-50"
                          : "rounded-tl-sm bg-white text-slate-800 dark:bg-[#202c33] dark:text-slate-100"
                      )}
                    >
                      <p className="mb-1 text-[10px] font-semibold tracking-wide text-slate-500 dark:text-slate-300/70">{message.role === "user" ? "You" : "Thabo"}</p>
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <Streamdown>{message.content}</Streamdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </p>
                      )}
                    </div>

                    {message.role === "user" && (
                      <div className="size-8 shrink-0 mt-1 rounded-full bg-secondary flex items-center justify-center">
                        <User className="size-4 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div
                  className="flex items-start gap-3"
                  style={
                    minHeightForLastMessage > 0
                      ? { minHeight: `${minHeightForLastMessage}px` }
                      : undefined
                  }
                >
                  <div className="size-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm dark:bg-[#202c33]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Thabo</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Thabo is thinking…</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <form
        ref={inputAreaRef}
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-2 border-t border-[#d7dadd] bg-[#f0f2f5] p-3 sm:p-4 dark:border-[#2a3942] dark:bg-[#202c33]"
      >
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Message Thabo"
          enterKeyHint="send"
          className="min-h-11 max-h-32 min-w-0 flex-1 resize-none rounded-full border-transparent bg-white px-5 py-3 text-sm leading-5 text-slate-900 caret-slate-900 shadow-sm shadow-slate-900/5 outline-none transition-shadow selection:bg-cyan-100 selection:text-slate-900 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#00a884]/35 dark:bg-[#2a3942] dark:text-slate-50 dark:caret-slate-50 dark:selection:bg-cyan-900/70 dark:selection:text-slate-50 dark:placeholder:text-slate-400"
          rows={1}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={startDictation}
          disabled={isLoading}
          aria-label={dictationStatus === "recording" ? "Stop voice dictation" : "Start voice dictation"}
          aria-pressed={dictationStatus === "recording"}
          className={cn("h-11 w-11 shrink-0 rounded-full border-transparent bg-white shadow-sm transition-all duration-150 active:scale-95 dark:bg-[#2a3942]", dictationStatus === "recording" && "border-rose-400/50 bg-rose-500/10 text-rose-600")}
        >
          {dictationStatus === "recording" ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </Button>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || dictationStatus === "recording"}
          aria-label="Send message"
          className="h-11 w-11 shrink-0 rounded-full bg-[#00a884] text-white shadow-md transition-transform duration-150 hover:bg-[#008f72] active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
        <p className={cn("basis-full px-1 text-[11px] leading-4 text-muted-foreground", dictationStatus === "idle" && "hidden sm:block")} role="status" aria-live="polite">
          {dictationStatus === "recording" ? "Recording… press the microphone again to stop and edit the text." : dictationStatus === "unsupported" ? "Voice dictation is not supported in this browser. You can type your message instead." : dictationStatus === "error" ? "Microphone access was unavailable. Check browser permissions and try again." : "Press the microphone to dictate, then review and send your message."}
        </p>
      </form>
    </div>
  );
}
