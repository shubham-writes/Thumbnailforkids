import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveThumbnail = mutation({
  args: {
    prompt: v.string(),
    imageUrl: v.string(),
    userId: v.optional(v.string()), // Kept for backwards compatibility but we will rely on identity subject
  },
  handler: async (ctx, args) => {
    // 1. Secure Mutation: Fetch real identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be authenticated to save a thumbnail.");
    }

    return await ctx.db.insert("history", {
      prompt: args.prompt,
      imageUrl: args.imageUrl,
      userId: identity.subject, // Storing Clerk User ID consistently
      createdAt: Date.now(),
    });
  },
});

export const getRecentThumbnails = query({
  args: {},
  handler: async (ctx) => {
    // 2. Database Security: Force Authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return []; // Return empty for unauthenticated to prevent leaking
    }

    // Fetch and explicitly filter so users only see their own generations
    const history = await ctx.db
      .query("history")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    // Since we don't have an index on userId right now, we filter in memory.
    // If you have thousands of generations, it's recommended to add an index for `userId`.
    const userHistory = history.filter(h => h.userId === identity.subject);
    
    return userHistory.slice(0, 20);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
