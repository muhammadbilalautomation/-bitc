import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { searchPublicProspects } from "./serpApi";
import { generateGeminiDraft, summarizeGeminiResearch, understandGeminiCommand } from "./gemini";
import { getChatConversationForUser, listChatConversationsForUser, saveChatConversationForUser } from "./db";
import { createLiveAvatarSession } from "./liveavatar";
import { answerFromKnowledgeBase, THABO_KNOWLEDGE_SOURCE } from "./knowledgeBase";
import { runThaboAction, THABO_ACTIONS } from "./actionGateway";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  elevenlabs: router({
    config: publicProcedure.query(() => ({ agentId: process.env.ELEVENLABS_AGENT_ID ?? "" })),
  }),
  liveavatar: router({
    createSession: publicProcedure.mutation(() => createLiveAvatarSession()),
  }),
  ai: router({
    understandCommand: publicProcedure
      .input(z.object({ text: z.string().min(1).max(1200) }))
      .mutation(({ input }) => understandGeminiCommand(input.text)),
    summarizeResearch: publicProcedure
      .input(z.object({ items: z.array(z.object({ name: z.string(), country: z.string(), sector: z.string(), fact: z.string(), fit: z.string(), source: z.string() })).max(10) }))
      .mutation(({ input }) => summarizeGeminiResearch(input.items)),
    generateDraft: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        country: z.string().min(1),
        sector: z.string().min(1),
        fact: z.string().min(1),
        fit: z.string().min(1),
      }))
      .mutation(({ input }) => generateGeminiDraft(input)),
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1).max(10),
      }))
      .mutation(({ input }) => answerFromKnowledgeBase(input.messages)),
  }),
  knowledge: router({
    source: publicProcedure.query(() => THABO_KNOWLEDGE_SOURCE),
    ask: publicProcedure
      .input(z.object({
        messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1).max(10),
      }))
      .mutation(({ input }) => answerFromKnowledgeBase(input.messages)),
  }),
  actions: router({
    execute: publicProcedure
      .input(z.object({
        action: z.enum(THABO_ACTIONS),
        userMessage: z.string().trim().min(1).max(4000),
        parameters: z.record(z.string(), z.unknown()).optional(),
        approved: z.boolean().optional(),
        conversationId: z.string().max(160).optional(),
        userId: z.string().max(160).optional(),
      }))
      .mutation(({ input }) => runThaboAction(input)),
  }),
  research: router({
    search: publicProcedure
      .input(z.object({
        country: z.string().min(1).max(80),
        sector: z.string().min(1).max(120),
        intent: z.enum(["investment", "export"]),
        count: z.number().int().min(1).max(10),
      }))
      .mutation(({ input }) => searchPublicProspects(input)),
  }),
  history: router({
    list: protectedProcedure.query(({ ctx }) => listChatConversationsForUser(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ conversationId: z.number().int().positive() }))
      .query(({ ctx, input }) => getChatConversationForUser(ctx.user.id, input.conversationId)),
    save: protectedProcedure
      .input(z.object({
        conversationId: z.number().int().positive().optional(),
        title: z.string().trim().min(1).max(160),
        messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(4000) })).min(1).max(2),
      }))
      .mutation(({ ctx, input }) => saveChatConversationForUser(ctx.user.id, input.title, input.messages, input.conversationId)),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

