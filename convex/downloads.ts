import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const resolve = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const download = await ctx.db
      .query("downloads")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!download) {
      throw new Error("Download token not found");
    }

    if (download.expiresAt < Date.now()) {
      throw new Error("Download token has expired");
    }

    const product = await ctx.db.get(download.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      product,
      download,
    };
  },
});

export const markUsed = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const download = await ctx.db
      .query("downloads")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!download) {
      throw new Error("Download token not found");
    }

    return await ctx.db.patch(download._id, {
      usedAt: Date.now(),
    });
  },
});
