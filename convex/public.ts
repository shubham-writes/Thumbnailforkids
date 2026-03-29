import { query } from "./_generated/server";

export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const history = await ctx.db.query("history").withIndex("by_createdAt").order("desc").take(8);
    return history.map((h) => ({
      url: h.imageUrl,
      prompt: h.prompt
    }));
  },
});
