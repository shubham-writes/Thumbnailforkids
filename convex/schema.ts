import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  history: defineTable({
    prompt: v.string(),
    imageUrl: v.string(),
    userId: v.optional(v.string()), // This should probably reference v.id("users") in a real scenario, but keeping it as a string is fine for now
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    credits: v.number(),
    isApproved: v.boolean(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
