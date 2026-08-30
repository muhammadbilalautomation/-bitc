import { useEffect, useRef, useState } from "react";
import { Conversation, type VoiceConversation } from "@elevenlabs/client";
import { AgentEventsEnum, LiveAvatarSession, SessionEvent, SessionState, VoiceChatState } from "@heygen/liveavatar-web-sdk";
import { Mic, Moon, Pause, ShieldCheck, Sun, Wifi, WifiOff, MessageCircle, X, MoreHorizontal, MoreVertical, Clock3, LogIn, Plus, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { getLiveAvatarStartErrorMessage, isLiveAvatarStartError } from "@shared/liveavatarErrors";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { AIChatBox } from "@/components/AIChatBox";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type AssistantState = "idle" | "connecting" | "listening" | "speaking" | "error";

type Message = {
  role: "user" | "agent";
  text: string;
};

type PublicChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }, error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

const stateCopy: Record<AssistantState, { label: string; sub: string }> = {
  idle: { label: "Ready for a conversation", sub: "Press the microphone to start Thabo" },
  connecting: { label: "Connecting securely", sub: "Opening your secure Thabo session" },
  listening: { label: "Listening", sub: "Thabo is ready for your voice" },
  speaking: { label: "Speaking", sub: "Thabo is responding" },
  error: { label: "Connection needs attention", sub: "Check the Thabo voice configuration and try again" },
};

const investmentSlides = [
  { sector: "Mining", title: "Responsible mineral investment", description: "Explore Botswana’s mining landscape, infrastructure and partnership pathways for responsible mineral development.", image: "/manus-storage/mining_a33b0c16.jpg", script: "Explore responsible mining opportunities in Botswana, supported by a stable investment environment and strong partnership potential." },
  { sector: "Agriculture", title: "Grow with Botswana", description: "Discover opportunities in modern agriculture, agri-processing, food security and sustainable value chains.", image: "/manus-storage/agriculture_9a56baa3.jpg", script: "Discover agriculture and agri-processing opportunities in Botswana, from production and logistics to sustainable value chains." },
  { sector: "Tourism", title: "Invest in extraordinary experiences", description: "Connect tourism, conservation and hospitality opportunities across Botswana’s distinctive natural destinations.", image: "/manus-storage/tourism_1d992526.jpg", script: "Explore tourism and hospitality opportunities in Botswana, where conservation, culture and premium experiences create new value." },
  { sector: "Diversified opportunities", title: "Find your next Botswana opportunity", description: "Use Thabo to explore sectors, understand the opportunity and start a focused conversation with BITC.", image: "/manus-storage/opportunities_97538063.jpg", script: "Tell Thabo what you are looking for, and begin a focused conversation about investment opportunities in Botswana." },
] as const;

const investorMarqueeItems = [
  "Investor Recruitment",
  "24/7 Virtual Foreign Investor Call Center Assistant",
  "Multi-Language Investor Communication",
  "Free Investor Calls in Multiple Languages",
  "No More Investor Recruitment Language Barriers",
  "Cold Calls and Cold Emails to Investors in Multiple Languages",
  "Support Investor Registrations by Emailing Application Forms in the User’s Language",
  "Investor Orientation and Selling Points",
  "DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS BOTSWANA - +267 75 602 481",
  "DEVELOPED BY: SENSTAR SOFTWARE SYSTEMS [BOTSWANA CITIZEN OWNED] - +267 75 602 481",
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = theme === "dark";
  const elevenlabsConfigQuery = trpc.elevenlabs.config.useQuery();
  const [assistantState, setAssistantState] = useState<AssistantState>("idle");
  const [session, setSession] = useState<VoiceConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessages, setChatMessages] = useState<PublicChatMessage[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [displayMenuOpen, setDisplayMenuOpen] = useState(false);
  const [streamActive, setStreamActive] = useState(true);
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState(0);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>();
  const chatMutation = trpc.ai.chat.useMutation();
  const liveAvatarMutation = trpc.liveavatar.createSession.useMutation();
  const historyListQuery = trpc.history.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const historyGetQuery = trpc.history.get.useQuery({ conversationId: activeConversationId as number }, { enabled: isAuthenticated && activeConversationId !== undefined, retry: false });
  const saveHistoryMutation = trpc.history.save.useMutation();
  const sessionRef = useRef<VoiceConversation | null>(null);
  const liveAvatarSessionRef = useRef<LiveAvatarSession | null>(null);
  const liveAvatarVideoRef = useRef<HTMLVideoElement>(null);
  const [liveAvatarActive, setLiveAvatarActive] = useState(false);
  const [liveAvatarCreditsUnavailable, setLiveAvatarCreditsUnavailable] = useState(false);
  const [liveAvatarPoster, setLiveAvatarPoster] = useState<string | null>(null);
  const liveAvatarSpeakingWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const agentId = elevenlabsConfigQuery.data?.agentId ?? "";
  const connected = assistantState === "listening" || assistantState === "speaking";
  const state = stateCopy[assistantState];
  const activeOpportunity = investmentSlides[activeOpportunityIndex];

  const stopInvestmentVoiceover = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const openChat = () => {
    stopInvestmentVoiceover();
    setStreamActive(false);
    setChatOpen(true);
  };

  useEffect(() => {
    if (!streamActive || chatOpen || connected || session) return;
    const timer = window.setInterval(() => setActiveOpportunityIndex(current => (current + 1) % investmentSlides.length), 9_000);
    return () => window.clearInterval(timer);
  }, [streamActive, chatOpen, connected, session]);

  useEffect(() => {
    if (!streamActive || chatOpen || !voiceoverEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(activeOpportunity.script);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [activeOpportunity, chatOpen, streamActive, voiceoverEnabled]);

  const sendChatMessage = async (content: string) => {
    const nextMessages: PublicChatMessage[] = [...chatMessages, { role: "user", content }];
    setChatMessages(nextMessages);
    try {
      const response = await chatMutation.mutateAsync({ messages: nextMessages });
      setChatMessages(current => [...current, { role: "assistant", content: response }]);
      if (isAuthenticated) {
        try {
          const savedId = await saveHistoryMutation.mutateAsync({
            conversationId: activeConversationId,
            title: content.slice(0, 72),
            messages: [{ role: "user", content }, { role: "assistant", content: response }],
          });
          if (savedId) setActiveConversationId(savedId);
          void historyListQuery.refetch();
        } catch {
          toast.error("Reply received, but this conversation could not be saved.");
        }
      }
    } catch {
      toast.error("Thabo chat is temporarily unavailable. Please try again.");
    }
  };

  const captureLiveAvatarFrame = () => {
    const video = liveAvatarVideoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.videoWidth === 0 || video.videoHeight === 0 || typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setLiveAvatarPoster(canvas.toDataURL("image/jpeg", 0.9));
  };

  const clearLiveAvatarSpeakingWatchdog = () => {
    if (liveAvatarSpeakingWatchdogRef.current) {
      clearTimeout(liveAvatarSpeakingWatchdogRef.current);
      liveAvatarSpeakingWatchdogRef.current = null;
    }
  };

  const startSession = async () => {
    if (liveAvatarSessionRef.current || sessionRef.current) return;
    stopInvestmentVoiceover();
    setStreamActive(false);

    let nextLiveSession: LiveAvatarSession | null = null;
    try {
      setAssistantState("connecting");
      const liveSession = await liveAvatarMutation.mutateAsync();
      nextLiveSession = new LiveAvatarSession(liveSession.sessionToken, { voiceChat: true, apiUrl: "/api/liveavatar" });
      const activeLiveSession = nextLiveSession;

      activeLiveSession.on(SessionEvent.SESSION_STREAM_READY, () => {
        // Keep the existing poster visible until the real stream has rendered its first frame.
        if (liveAvatarVideoRef.current) activeLiveSession.attach(liveAvatarVideoRef.current);
      });
      activeLiveSession.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        clearLiveAvatarSpeakingWatchdog();
        setAssistantState("speaking");
        // Keep the microphone available for barge-in. If the user starts a turn,
        // interrupt the current response instead of making them wait in silence.
        liveAvatarSpeakingWatchdogRef.current = setTimeout(() => {
          liveAvatarSpeakingWatchdogRef.current = null;
          if (liveAvatarSessionRef.current === activeLiveSession) setAssistantState("listening");
        }, 45_000);
      });
      activeLiveSession.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        clearLiveAvatarSpeakingWatchdog();
        setAssistantState("listening");
      });
      activeLiveSession.on(AgentEventsEnum.USER_SPEAK_STARTED, () => {
        clearLiveAvatarSpeakingWatchdog();
        if (activeLiveSession.state === SessionState.CONNECTED) {
          try {
            activeLiveSession.interrupt();
          } catch {
            // The provider may already have ended the current response.
          }
        }
        setAssistantState("listening");
      });
      activeLiveSession.on(AgentEventsEnum.USER_TRANSCRIPTION, event => {
        if (event.text.trim()) setMessages(current => [...current.slice(-5), { role: "user", text: event.text.trim() }]);
      });
      activeLiveSession.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, event => {
        if (event.text.trim()) setMessages(current => [...current.slice(-5), { role: "agent", text: event.text.trim() }]);
      });
      activeLiveSession.on(SessionEvent.SESSION_STATE_CHANGED, nextState => {
        if (nextState === SessionState.CONNECTED) setAssistantState("listening");
        if (nextState === SessionState.DISCONNECTING || nextState === SessionState.DISCONNECTED) {
          clearLiveAvatarSpeakingWatchdog();
          setAssistantState("idle");
        }
      });
      activeLiveSession.on(SessionEvent.SESSION_DISCONNECTED, () => {
        clearLiveAvatarSpeakingWatchdog();
        if (liveAvatarSessionRef.current === activeLiveSession) liveAvatarSessionRef.current = null;
        setLiveAvatarActive(false);
        setAssistantState("idle");
      });

      // Bound the SDK's connection promise so a stalled WebSocket cannot leave the
      // button stuck on Connecting forever. voiceChat: true starts the mic pipeline
      // exactly once inside session.start(); the mic stays available for barge-in.
      await withTimeout(activeLiveSession.start(), 30_000, "LiveAvatar connection timed out.");
      if (activeLiveSession.voiceChat.state !== VoiceChatState.ACTIVE) {
        throw new Error("Microphone permission is required for Thabo to hear you.");
      }
      liveAvatarSessionRef.current = activeLiveSession;
      if (liveAvatarVideoRef.current) activeLiveSession.attach(liveAvatarVideoRef.current);
      return;
    } catch (error) {
      clearLiveAvatarSpeakingWatchdog();
      setLiveAvatarActive(false);
      if (nextLiveSession) {
        try {
          nextLiveSession.voiceChat.stop();
          await nextLiveSession.stop();
        } catch {
          // The SDK may already have cleaned up a failed connection.
        }
      }
      liveAvatarSessionRef.current = null;
      const errorMessage = error instanceof Error ? error.message : "";
      const noCredits = /no credits available|insufficient credits|credits for session|4033/i.test(errorMessage);
      if (noCredits) setLiveAvatarCreditsUnavailable(true);
      toast.error(isLiveAvatarStartError(error)
        ? getLiveAvatarStartErrorMessage(error)
        : errorMessage || "LiveAvatar could not start. Trying the connected Thabo voice service.");
      // A failed LiveAvatar session must not strand the user. Continue to the
      // ElevenLabs voice path as a degraded audio fallback; no browser speech is
      // synthesized here, so the agent cannot produce a duplicate voice.
    }

    if (!agentId) {
      setAssistantState("error");
      toast.error("Thabo voice service is not configured.");
      return;
    }

    try {
      setAssistantState("connecting");
      const nextSession = await Conversation.startSession({
        agentId,
        connectionType: "websocket",
        textOnly: false,
        onConnect: () => {
          setAssistantState("listening");
          toast.success("Thabo voice service connected.");
        },
        onDisconnect: () => {
          sessionRef.current = null;
          setSession(null);
          setAssistantState("idle");
        },
        onError: message => {
          sessionRef.current = null;
          setSession(null);
          setAssistantState("error");
          toast.error(`Thabo connection error: ${message}`);
        },
        onModeChange: ({ mode }) => setAssistantState(mode === "speaking" ? "speaking" : "listening"),
        onInterruption: () => {
          setAssistantState("listening");
          toast.info("Thabo is listening to your next turn.");
        },
        onMessage: ({ message, source }) => {
          setMessages(current => [...current.slice(-5), { role: source === "user" ? "user" : "agent", text: message }]);
        },
      });
      sessionRef.current = nextSession;
      setSession(nextSession);
    } catch (error) {
      setAssistantState("error");
      toast.error(error instanceof Error ? error.message : "Thabo voice service could not start.");
    }
  };

  const stopSession = async () => {
    clearLiveAvatarSpeakingWatchdog();
    if (liveAvatarSessionRef.current) {
      const activeLiveSession = liveAvatarSessionRef.current;
      captureLiveAvatarFrame();
      activeLiveSession.voiceChat.stop();
      await activeLiveSession.stop();
      liveAvatarSessionRef.current = null;
      setLiveAvatarActive(false);
    }
    await sessionRef.current?.endSession();
    sessionRef.current = null;
    setSession(null);
    setAssistantState("idle");
    if (!chatOpen) setStreamActive(true);
  };

  useEffect(() => {
    if (liveAvatarActive && liveAvatarSessionRef.current && liveAvatarVideoRef.current && liveAvatarSessionRef.current.state === SessionState.CONNECTED) {
      liveAvatarSessionRef.current.attach(liveAvatarVideoRef.current);
    }
  }, [liveAvatarActive]);

  useEffect(() => () => {
    liveAvatarSessionRef.current?.voiceChat.stop();
    void liveAvatarSessionRef.current?.stop();
    void sessionRef.current?.endSession();
  }, []);

  useEffect(() => {
    if (!historyGetQuery.data) return;
    setChatMessages(historyGetQuery.data.messages.map(message => ({ role: message.role, content: message.content })));
    setHistoryMenuOpen(false);
  }, [historyGetQuery.data]);

  return (
    <div className={`min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#05070d] text-slate-100" : "light-theme bg-[#eef4f7] text-slate-900"}`}>
      <div className={`pointer-events-none fixed inset-0 ${isDark ? "bg-[radial-gradient(circle_at_50%_8%,rgba(20,184,166,0.14),transparent_33%),radial-gradient(circle_at_10%_90%,rgba(124,58,237,0.12),transparent_30%)]" : "bg-[radial-gradient(circle_at_50%_8%,rgba(14,165,233,0.12),transparent_36%),radial-gradient(circle_at_90%_90%,rgba(20,184,166,0.1),transparent_30%)]"}`} />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <section aria-labelledby="top-invest-banner-title" className="relative -mx-5 mb-5 min-h-[172px] w-[calc(100%+2.5rem)] overflow-hidden rounded-none border border-cyan-200/15 bg-[#061118] px-5 py-7 shadow-[0_22px_60px_rgba(2,8,23,0.28)] sm:-mx-8 sm:min-h-[198px] sm:w-[calc(100%+4rem)] sm:rounded-[24px] sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-75" style={{ backgroundImage: "url('/manus-storage/botswana-trade-investment-banner_7eff5003.png')" }} />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,12,20,0.96)_0%,rgba(3,12,20,0.72)_40%,rgba(3,12,20,0.46)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(117,170,219,0.2),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(20,184,166,0.12),transparent_32%)]" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#75aadb]/10 bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_18px,rgba(117,170,219,0.08)_19px,transparent_20px)] opacity-80" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-[#75aadb]/40 to-transparent" />
          <div className="absolute left-4 top-4 z-20 sm:left-6 sm:top-5"><a href="https://www.bitc.co.bw/" target="_blank" rel="noreferrer" aria-label="Open BITC main page" className="inline-flex items-center rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-100 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200">Home</a></div>
          <div className="relative flex min-h-[116px] items-center justify-center px-12 sm:min-h-[142px] sm:px-0"><div className="w-full max-w-4xl text-center"><p className="mx-auto mb-3 max-w-[220px] text-[7px] font-semibold uppercase tracking-[0.12em] text-cyan-100/75 sm:max-w-none sm:text-[9px] sm:tracking-[0.38em]"><span className="sm:hidden">BOTSWANA TRADE &amp; INVESTMENT</span><span className="hidden sm:inline">BOTSWANA TRADE &amp; INVESTMENT · BITC</span></p><h2 id="top-invest-banner-title" className="text-[clamp(1.6rem,6vw,3.6rem)] font-black leading-none tracking-[0.1em] sm:tracking-[0.18em]"><span className="bg-[linear-gradient(to_bottom,#75aadb_0%,#75aadb_34%,#fff_34%,#fff_44%,#111_44%,#111_56%,#fff_56%,#fff_66%,#75aadb_66%,#75aadb_100%)] bg-clip-text text-transparent">INVEST IN BOTSWANA</span></h2><p className="mt-3 text-xs tracking-[0.18em] text-slate-200/80 sm:text-sm">A connected future for business, trade and investment.</p><div className="mt-4 flex justify-center gap-1.5" aria-hidden="true"><span className="h-0.5 w-9 rounded-full bg-[#75aadb]" /><span className="h-0.5 w-4 rounded-full bg-white" /><span className="h-0.5 w-9 rounded-full bg-slate-950" /></div></div></div>
          <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-5"><button type="button" onClick={() => setDisplayMenuOpen(current => !current)} aria-label="Open display settings" aria-haspopup="menu" aria-expanded={displayMenuOpen} className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-slate-100 shadow-lg backdrop-blur-md transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"><MoreVertical className="size-5" /></button>{displayMenuOpen && <div role="menu" className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-white/15 bg-[#0d1a27]/95 p-2 text-slate-100 shadow-2xl backdrop-blur-xl"><p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/65">Display mode</p><button type="button" role="menuitem" onClick={() => { setTheme?.("light"); setDisplayMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10"><Sun className="size-4 text-amber-300" /> Light Mode</button><button type="button" role="menuitem" onClick={() => { setTheme?.("dark"); setDisplayMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10"><Moon className="size-4 text-cyan-200" /> Dark Mode</button></div>}</div>
        </section>

        <section aria-label="Investor services" className={`investor-marquee relative -mx-5 mb-5 w-[calc(100%+2.5rem)] overflow-hidden border-y sm:-mx-8 sm:w-[calc(100%+4rem)] ${isDark ? "border-cyan-200/20 bg-[#0d2433] shadow-[0_14px_36px_rgba(2,8,23,0.28)]" : "border-cyan-900/20 bg-[#0b2635] shadow-[0_14px_36px_rgba(8,47,73,0.18)]"}`}>
          <div className="investor-marquee-track flex min-w-max items-center py-4" aria-hidden="true">
            {[...investorMarqueeItems, ...investorMarqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className={`inline-flex shrink-0 items-center gap-5 px-5 text-sm font-semibold tracking-[0.04em] sm:px-7 sm:text-base ${isDark ? "text-cyan-50" : "text-white"}`}>
                <span className={`size-1.5 rounded-full ${isDark ? "bg-cyan-200" : "bg-[#75aadb]"} shadow-[0_0_10px_rgba(103,232,249,0.7)]`} />
                {item}
              </span>
            ))}
          </div>
          <p className="sr-only">{investorMarqueeItems.join(". ")}</p>
        </section>

        <section aria-labelledby="investment-stream-title" className={`investment-stream mx-auto mb-8 w-full max-w-6xl overflow-hidden rounded-[30px] border shadow-[0_25px_80px_rgba(2,8,23,0.35)] ${isDark ? "border-cyan-200/15 bg-[#091925]/85" : "border-slate-900/10 bg-white/85 shadow-slate-900/10"}`}>
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-7">
            <div><p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? "text-cyan-200/75" : "text-cyan-800/75"}`}>Live investment channel</p><h2 id="investment-stream-title" className={`mt-1 text-xl font-semibold tracking-tight sm:text-2xl ${isDark ? "text-white" : "text-slate-900"}`}>Investment opportunities in Botswana</h2></div>
            <div className="flex items-center gap-2"><span className={`investment-live-dot ${streamActive ? "investment-live-dot-active" : ""}`} aria-hidden="true" /><span className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline ${isDark ? "text-cyan-100/70" : "text-cyan-900/70"}`}>{streamActive ? "Live rotation" : "Paused for chat"}</span></div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="investment-stream-image-wrap"><img src={activeOpportunity.image} alt={`${activeOpportunity.sector} investment opportunity in Botswana`} className="investment-stream-image" /><div className="investment-stream-overlay" /><div className="investment-stream-sector">{activeOpportunity.sector}</div><div className="investment-stream-progress" aria-hidden="true"><span key={activeOpportunityIndex} /></div></div>
            <div className="flex flex-col justify-between p-6 sm:p-8"><div><p className={`text-xs font-bold uppercase tracking-[0.22em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>THABO voice-over</p><h3 className={`mt-3 text-2xl font-semibold leading-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>{activeOpportunity.title}</h3><p className={`mt-4 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{activeOpportunity.description}</p></div><div className="mt-7 flex flex-wrap items-center gap-3"><button type="button" onClick={() => { const next = !voiceoverEnabled; setVoiceoverEnabled(next); if (!next) stopInvestmentVoiceover(); }} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 ${isDark ? "border-cyan-200/20 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20" : "border-cyan-800/15 bg-cyan-700/10 text-cyan-900 hover:bg-cyan-700/15"}`} aria-pressed={voiceoverEnabled}>{voiceoverEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}{voiceoverEnabled ? "Voice-over on" : "Enable voice-over"}</button><button type="button" onClick={openChat} className="inline-flex items-center gap-2 rounded-full bg-cyan-200 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"><MessageCircle className="size-4" /> Start chat</button></div><p className={`mt-4 text-[11px] leading-5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>The visual channel rotates until a visitor starts chat. Voice-over uses the browser in this demo and can be replaced with the approved paid voice service for production.</p></div>
          </div>
          <div className={`flex flex-wrap items-center gap-2 border-t px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] ${isDark ? "border-white/10 text-slate-400" : "border-slate-900/10 text-slate-500"}`}><span>Language programme</span><span className="language-chip">Setswana</span><span className="language-chip">Shona</span><span className="language-chip">Ndebele</span><span className="language-chip">Zulu</span><span className="language-chip">Afrikaans</span></div>
        </section>

        <main className="flex flex-1 items-center justify-center py-8 sm:py-12">
          <section className={`relative w-full max-w-6xl overflow-hidden rounded-[34px] border p-7 shadow-[0_25px_90px_rgba(2,8,23,0.55)] backdrop-blur-2xl transition-colors duration-300 sm:p-12 ${isDark ? "border-cyan-200/15 bg-[#0b1320]/80" : "border-slate-900/10 bg-white/75 shadow-slate-900/10"}`}>
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(250px,0.9fr)_300px_minmax(0,1.2fr)] lg:gap-10 xl:gap-14">
              <div className="order-2 text-left lg:order-1">
                <div className="live-transcript" aria-live="polite" aria-label="Live conversation transcript">
                  {messages.length === 0 ? <p className={`text-sm ${isDark ? "text-slate-600" : "text-slate-500"}`}>Your conversation transcript will appear here.</p> : messages.map((item, index) => <p key={`${item.role}-${index}`} className={`live-transcript-line ${item.role === "user" ? "live-transcript-user" : "live-transcript-agent"}`}><span className="live-transcript-role">{item.role === "user" ? "You" : "Thabo"}</span><span>{item.text}</span></p>)}
                </div>
              </div>

              <div className="order-1 text-center lg:order-2">
                <div className={`assistant-face-shell mx-auto assistant-face-${assistantState}`} aria-label={`Thabo is ${assistantState}`}>
                  <div className="assistant-face-halo" />
                  <div className="assistant-face-media">
                    <img src={liveAvatarPoster ?? "/manus-storage/thabo-anthony-liveavatar-reference_e381baca.png"} alt="Thabo, African business professional LiveAvatar" className="assistant-face-image" />
                    <video ref={liveAvatarVideoRef} autoPlay playsInline onLoadedData={captureLiveAvatarFrame} onPlaying={() => setLiveAvatarActive(true)} onError={() => setLiveAvatarActive(false)} onEnded={() => setLiveAvatarActive(false)} className={`assistant-face-image assistant-face-video ${liveAvatarActive ? "assistant-face-video-visible" : ""}`} aria-label="Live Thabo lip-sync avatar" />
                  </div>
                  <span className="assistant-face-status">{assistantState === "speaking" ? "Speaking" : assistantState === "listening" ? "Listening" : assistantState === "connecting" ? "Connecting" : assistantState === "error" ? "Check" : "Ready"}</span>
                </div>
                <p className={`mt-6 text-2xl font-medium tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>{state.label}</p>
                <p className={`mt-2 text-sm ${isDark ? "text-slate-500" : "text-slate-600"}`}>{state.sub}</p>
              </div>

              <div className="order-3">
                <div className="flex items-start justify-between gap-4"><div><p className={`text-xs font-semibold uppercase tracking-[0.24em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>Private voice session</p><h2 className={`mt-3 text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Talk to Thabo</h2></div><Badge className={isDark ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/5" : "border-slate-900/10 bg-slate-900/5 text-slate-700 hover:bg-slate-900/10"}>{assistantState}</Badge></div>
                <p className={`mt-4 max-w-xl text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Speak with Thabo about Botswana investment, trade, and business-development opportunities. Voice and chat are available in this demo.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button onClick={connected || session ? stopSession : startSession} disabled={assistantState === "connecting"} className={`h-12 rounded-full px-5 ${connected || session ? "bg-rose-400 text-rose-950 hover:bg-rose-300" : "bg-cyan-200 text-slate-950 hover:bg-cyan-100"}`}>
                    {connected || session ? <Pause className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                    {assistantState === "connecting" ? "Connecting…" : connected || session ? "End voice session" : "Start voice chat"}
                  </Button>
                </div>

                <div className={`mt-7 rounded-2xl border p-4 shadow-inner shadow-cyan-950/10 ${isDark ? "border-white/10 bg-black/25" : "border-slate-900/10 bg-white/60"}`}>
                                    <div className={`flex items-center justify-between text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}><span>Connection status</span><span className="flex items-center gap-1.5 text-emerald-600">
{connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />} {connected ? "Connected" : assistantState === "connecting" ? "Connecting" : "Standby"}</span></div>
                  <div className={`mt-4 flex items-center gap-2 text-xs ${isDark ? "text-slate-500" : "text-slate-600"}`}><ShieldCheck className={`h-4 w-4 ${isDark ? "text-cyan-200" : "text-cyan-700"}`} /> Your conversation stays focused on the BITC Thabo demo experience.</div>
                  {liveAvatarCreditsUnavailable && <p className={`mt-3 rounded-xl border px-3 py-2 text-xs leading-5 ${isDark ? "border-amber-200/15 bg-amber-200/5 text-amber-100/80" : "border-amber-700/15 bg-amber-50 text-amber-900"}`}>LiveAvatar lip-sync is unavailable because this account has insufficient session credits. Thabo’s connected voice service is used as a voice-only fallback; add credits and refresh the website to restore lip-sync.</p>}
                </div>
              </div>
            </div>
          </section>
        </main>

        <section aria-labelledby="contact-thabo-title" className={`mx-auto mb-8 w-full max-w-6xl rounded-[30px] border p-6 shadow-xl backdrop-blur-xl sm:p-8 ${isDark ? "border-cyan-200/10 bg-[#0b1320]/75 shadow-black/20" : "border-slate-900/10 bg-white/80 shadow-slate-900/10"}`}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>Contact Thabo</p><h2 id="contact-thabo-title" className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>Investor call lines</h2></div><p className={`max-w-md text-sm leading-6 sm:text-right ${isDark ? "text-slate-400" : "text-slate-600"}`}>Use the displayed numbers to connect with the BITC Thabo experience.</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className={`rounded-2xl border p-5 ${isDark ? "border-cyan-200/10 bg-cyan-200/[0.04]" : "border-cyan-800/10 bg-cyan-800/[0.03]"}`}><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-cyan-200/65" : "text-cyan-800/70"}`}>Investor line</p><p className={`mt-2 text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>+1 (571) 464-5456</p></div><div className={`rounded-2xl border p-5 ${isDark ? "border-cyan-200/10 bg-cyan-200/[0.04]" : "border-cyan-800/10 bg-cyan-800/[0.03]"}`}><p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? "text-cyan-200/65" : "text-cyan-800/70"}`}>Thabo line</p><p className={`mt-2 text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>+1 (267) 828-9063</p></div></div>
        </section>

        <section aria-labelledby="business-focus-title" className={`mx-auto mb-8 w-full max-w-6xl rounded-[30px] border p-6 shadow-xl backdrop-blur-xl sm:p-8 ${isDark ? "border-white/10 bg-[#0b1320]/65 shadow-black/20" : "border-slate-900/10 bg-white/75 shadow-slate-900/10"}`}>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className={`text-[10px] font-semibold uppercase tracking-[0.32em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>BITC business focus</p><h2 id="business-focus-title" className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>Make the next connection count.</h2></div><p className={`max-w-md text-sm leading-6 sm:text-right ${isDark ? "text-slate-400" : "text-slate-600"}`}>A focused space for conversations that move investment, trade, and partnerships forward.</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className={`rounded-2xl border p-4 ${isDark ? "border-cyan-200/10 bg-cyan-200/[0.04]" : "border-cyan-800/10 bg-cyan-800/[0.03]"}`}><p className={`text-sm font-semibold ${isDark ? "text-cyan-100" : "text-cyan-900"}`}>Investment</p><p className={`mt-1 text-xs leading-5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>Explore pathways into Botswana’s business ecosystem.</p></div><div className={`rounded-2xl border p-4 ${isDark ? "border-cyan-200/10 bg-cyan-200/[0.04]" : "border-cyan-800/10 bg-cyan-800/[0.03]"}`}><p className={`text-sm font-semibold ${isDark ? "text-cyan-100" : "text-cyan-900"}`}>Trade</p><p className={`mt-1 text-xs leading-5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>Start a focused conversation about market opportunities.</p></div><div className={`rounded-2xl border p-4 ${isDark ? "border-cyan-200/10 bg-cyan-200/[0.04]" : "border-cyan-800/10 bg-cyan-800/[0.03]"}`}><p className={`text-sm font-semibold ${isDark ? "text-cyan-100" : "text-cyan-900"}`}>Partnerships</p><p className={`mt-1 text-xs leading-5 ${isDark ? "text-slate-500" : "text-slate-600"}`}>Use Thabo to frame your next business connection.</p></div></div>
        </section>

        <Dialog open={chatOpen} onOpenChange={open => { setChatOpen(open); if (open) { stopInvestmentVoiceover(); setStreamActive(false); } else if (!connected && !session) setStreamActive(true); }}>
          <DialogContent showCloseButton={false} className={`max-w-5xl overflow-hidden rounded-[30px] border p-0 shadow-[0_30px_100px_rgba(2,8,23,0.4)] ${isDark ? "border-cyan-200/15 bg-[#08111f]" : "border-slate-900/10 bg-[#f8fbfc]"}`}>
            <div className={`flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-7 ${isDark ? "border-white/10 bg-[linear-gradient(110deg,rgba(34,211,238,0.12),transparent_48%)]" : "border-slate-900/10 bg-[linear-gradient(110deg,rgba(14,165,233,0.08),transparent_48%)]"}`}>
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative shrink-0">
                  <button type="button" onClick={() => setHistoryMenuOpen(current => !current)} aria-label="Open chat history" aria-expanded={historyMenuOpen} className={`flex size-10 items-center justify-center rounded-2xl border transition-colors ${isDark ? "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" : "border-slate-900/10 text-slate-600 hover:bg-slate-900/10 hover:text-slate-950"}`}><MoreHorizontal className="size-5" /></button>
                  {historyMenuOpen && <div className={`absolute left-0 top-12 z-50 w-[min(18rem,calc(100vw-3rem))] rounded-2xl border p-2 shadow-2xl ${isDark ? "border-white/10 bg-[#111c2c] text-slate-100" : "border-slate-900/10 bg-white text-slate-900"}`}>
                    <div className="flex items-center justify-between px-3 py-2"><div><p className="text-xs font-semibold">Your conversations</p><p className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>{isAuthenticated ? `${historyListQuery.data?.length ?? 0} saved` : "Sign in to save history"}</p></div><Clock3 className={`size-4 ${isDark ? "text-cyan-200" : "text-cyan-700"}`} /></div>
                    {!isAuthenticated ? <button type="button" onClick={startLogin} className={`mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${isDark ? "hover:bg-white/10" : "hover:bg-slate-900/5"}`}><LogIn className="size-4" /> Sign in to view your history</button> : <><button type="button" onClick={() => { setActiveConversationId(undefined); setChatMessages([]); setHistoryMenuOpen(false); }} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold ${isDark ? "hover:bg-white/10" : "hover:bg-slate-900/5"}`}><Plus className="size-4" /> New conversation</button><div className={`my-1 border-t ${isDark ? "border-white/10" : "border-slate-900/10"}`} />{historyListQuery.data?.length ? historyListQuery.data.map(item => <button type="button" key={item.id} onClick={() => setActiveConversationId(item.id)} className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-xs ${activeConversationId === item.id ? isDark ? "bg-cyan-300/10 text-cyan-100" : "bg-cyan-700/10 text-cyan-900" : isDark ? "hover:bg-white/10" : "hover:bg-slate-900/5"}`}><MessageCircle className="mt-0.5 size-3.5 shrink-0" /><span className="min-w-0"><span className="block truncate font-medium">{item.title}</span><span className={`block text-[10px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>{new Date(item.updatedAt).toLocaleDateString()}</span></span></button>) : <p className={`px-3 py-3 text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>No saved conversations yet.</p>}</>}
                  </div>}
                </div>
                <div className="min-w-0"><p className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>BITC virtual concierge</p><DialogTitle className={`mt-1 text-xl tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Chat with Thabo</DialogTitle><DialogDescription className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>Ask about Botswana investment, trade, and business opportunities.</DialogDescription></div>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} aria-label="Close Chat with Thabo" className={`flex size-10 shrink-0 items-center justify-center rounded-2xl transition-colors ${isDark ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-900/10 hover:text-slate-950"}`}><X className="size-5" /></button>
            </div>
            <div className={`p-3 sm:p-5 ${isDark ? "bg-[radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.08),transparent_35%)]" : "bg-[radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.06),transparent_35%)]"}`}><AIChatBox messages={chatMessages} onSendMessage={sendChatMessage} isLoading={chatMutation.isPending} height="min(600px, calc(100vh - 190px))" placeholder="Message Thabo…" emptyStateMessage="Welcome to BITC" showHeader={false} suggestedPrompts={["What investment opportunities does Botswana offer?", "How can I connect with BITC?", "Tell me about trade opportunities in Botswana."]} className={isDark ? "border-white/10 bg-black/20" : "border-slate-900/10 bg-white/80"} /></div>
          </DialogContent>
        </Dialog>

        <div className="fixed inset-x-5 bottom-5 z-40 flex items-end justify-end sm:inset-x-7 sm:bottom-7">
          <button type="button" onClick={openChat} className={`group relative flex items-center gap-3 rounded-full border px-3 py-2.5 text-sm font-semibold shadow-[0_16px_40px_rgba(2,8,23,0.28)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(2,8,23,0.35)] sm:px-4 ${isDark ? "border-cyan-200/20 bg-[#0b1320]/90 text-cyan-100" : "border-cyan-800/15 bg-white/95 text-slate-900"}`}>
            <span className={`absolute bottom-[calc(100%+0.75rem)] right-0 whitespace-nowrap rounded-2xl border px-4 py-2 text-xs font-semibold shadow-lg animate-pulse ${isDark ? "border-cyan-200/20 bg-[#0b1320]/95 text-cyan-100" : "border-cyan-800/15 bg-white text-slate-900"}`}>Chat with Thabo</span>
            <span className="relative flex size-10 items-center justify-center rounded-full bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20"><MessageCircle className="relative z-10 size-5" /><span className="absolute inset-0 rounded-full bg-cyan-300/50 animate-[pulse_3s_ease-in-out_infinite]" /></span>
            <span className="hidden sm:inline">Open chat</span><span className="sr-only">Open Chat with Thabo</span>
          </button>
        </div>

        <section aria-labelledby="qr-access-title" className={`mx-auto mb-8 w-full max-w-3xl rounded-[28px] border p-5 backdrop-blur-xl transition-colors duration-300 sm:p-7 ${isDark ? "border-cyan-200/15 bg-white/[0.035] shadow-xl shadow-black/20" : "border-slate-900/10 bg-white/70 shadow-xl shadow-slate-900/10"}`}>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <a href="https://bitcassist-hub2w6hr.manus.space" target="_blank" rel="noreferrer" className={`group shrink-0 rounded-2xl border bg-white p-3 shadow-lg transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 ${isDark ? "border-white/10 shadow-cyan-950/20" : "border-slate-900/10 shadow-slate-900/10"}`}>
              <img src="/manus-storage/thabo-qr-code-clean-exact_b2ad3012.png" alt="QR code to access Thabo" className="h-56 w-56 object-contain sm:h-64 sm:w-64" />
            </a>
            <div>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.26em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>Quick access</p>
              <h2 id="qr-access-title" className={`mt-2 text-xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Scan the QR code to access Thabo.</h2>
              <p className={`mt-2 max-w-xl text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>Use your phone camera to scan the provided code, or open the Thabo portal directly from this panel.</p>
              <a href="https://bitcassist-hub2w6hr.manus.space" target="_blank" rel="noreferrer" className={`mt-4 inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/80 ${isDark ? "border-cyan-200/20 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20" : "border-cyan-800/20 bg-cyan-700/10 text-cyan-900 hover:bg-cyan-700/15"}`}>Open Thabo portal</a>
            </div>
          </div>
        </section>

        <section aria-labelledby="partners-title" className={`mx-auto mb-8 w-full max-w-6xl rounded-[28px] border p-5 backdrop-blur-xl sm:p-7 ${isDark ? "border-white/10 bg-white/[0.035]" : "border-slate-900/10 bg-white/70"}`}>
          <p id="partners-title" className={`text-center text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? "text-cyan-200/70" : "text-cyan-800/75"}`}>BITC ecosystem</p>
          <div className="mt-5 grid items-center gap-4 sm:grid-cols-3">
            <div className="flex h-24 items-center justify-center rounded-2xl bg-white px-5 py-3"><img src="/manus-storage/bitc-go-botswana_553a1dd5.jpg" alt="Go Botswana and Botswana Investment and Trade Centre logo" className="max-h-16 w-full object-contain" /></div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-white px-5 py-3"><img src="/manus-storage/global-expo-botswana_041f2970.jpg" alt="Global Expo Botswana logo" className="max-h-16 w-full object-contain" /></div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-white px-5 py-3"><img src="/manus-storage/botswana-investment-trade-centre_885701e1.jpg" alt="Botswana Investment and Trade Centre logo" className="max-h-16 w-full object-contain" /></div>
          </div>
        </section>

        <footer className={`flex flex-col items-center gap-3 border-t pt-5 text-center text-[10px] uppercase tracking-[0.18em] sm:flex-row sm:justify-between sm:text-left ${isDark ? "border-white/10 text-slate-600" : "border-slate-900/10 text-slate-500"}`}><span>BITC · Thabo business assistant</span><span>{agentId ? "Thabo voice configured" : "Thabo voice unavailable"}</span><span>Developed by: Senstar Software Systems Botswana · <a href="tel:+26775602481" className="transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70">+267 75 602 481</a></span></footer>
      </div>
    </div>
  );
}
