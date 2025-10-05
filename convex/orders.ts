import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getByStripeSession = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripe_session", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .unique();
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      title: v.string(),
      priceCents: v.number(),
      qty: v.number(),
    })),
    amountTotalCents: v.number(),
    currency: v.string(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    // Generate download tokens for each product
    const downloadTokens = args.items.map(() => 
      `dl_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
    );

    const orderId = await ctx.db.insert("orders", {
      userId: userId || undefined,
      email: args.email,
      items: args.items,
      amountTotalCents: args.amountTotalCents,
      currency: args.currency,
      stripeSessionId: args.stripeSessionId,
      paymentStatus: "paid",
      downloadTokens,
      createdAt: Date.now(),
    });

    // Create download records
    const expiresAt = Date.now() + (72 * 60 * 60 * 1000); // 72 hours
    
    for (let i = 0; i < args.items.length; i++) {
      const item = args.items[i];
      const token = downloadTokens[i];
      
      await ctx.db.insert("downloads", {
        token,
        productId: item.productId,
        orderId,
        email: args.email,
        expiresAt,
      });
    }

    return orderId;
  },
});
