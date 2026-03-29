import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveThumbnail = mutation({
  args: {
    prompt: v.string(),
    imageUrl: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("history", {
      prompt: args.prompt,
      imageUrl: args.imageUrl,
      userId: args.userId,
      createdAt: Date.now(),
    });
  },
});

export const getRecentThumbnails = query({
  args: {},
  handler: async (ctx) => {
    // Fetch last 20 generated thumbnails
    return await ctx.db
      .query("history")
      .withIndex("by_createdAt")
      .order("desc")
      .take(20);
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
