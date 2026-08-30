import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { chatConversations, chatMessages, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listChatConversationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatConversations).where(eq(chatConversations.userId, userId)).orderBy(desc(chatConversations.updatedAt)).limit(50);
}

export async function getChatConversationForUser(userId: number, conversationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const conversations = await db.select().from(chatConversations).where(and(eq(chatConversations.id, conversationId), eq(chatConversations.userId, userId))).limit(1);
  if (!conversations[0]) return undefined;
  const messages = await db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(chatMessages.createdAt);
  return { conversation: conversations[0], messages };
}

export async function saveChatConversationForUser(userId: number, title: string, messages: Array<{ role: "user" | "assistant"; content: string }>, conversationId?: number) {
  const db = await getDb();
  if (!db) return undefined;

  let id = conversationId;
  if (id !== undefined) {
    const owned = await db.select({ id: chatConversations.id }).from(chatConversations).where(and(eq(chatConversations.id, id), eq(chatConversations.userId, userId))).limit(1);
    if (!owned[0]) return undefined;
  } else {
    const inserted = await db.insert(chatConversations).values({ userId, title }).$returningId();
    id = inserted[0]?.id;
  }

  if (!id) return undefined;
  await db.update(chatConversations).set({ title, updatedAt: new Date() }).where(and(eq(chatConversations.id, id), eq(chatConversations.userId, userId)));
  if (messages.length > 0) {
    await db.insert(chatMessages).values(messages.map(message => ({ conversationId: id as number, role: message.role, content: message.content })));
  }
  return id;
}
