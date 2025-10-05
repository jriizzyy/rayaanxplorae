import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    let cart;
    if (userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart) {
      return { items: [], total: 0 };
    }

    // Get product details for each cart item
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    const total = itemsWithProducts.reduce((sum, item) => {
      return sum + (item.product?.priceCents || 0) * item.qty;
    }, 0);

    return {
      items: itemsWithProducts,
      total,
    };
  },
});

export const addItem = mutation({
  args: {
    productId: v.id("products"),
    qty: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const now = Date.now();

    // Find existing cart
    let cart;
    if (userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart) {
      // Create new cart
      return await ctx.db.insert("carts", {
        userId: userId || undefined,
        sessionId: args.sessionId,
        items: [{ productId: args.productId, qty: args.qty }],
        createdAt: now,
        updatedAt: now,
      });
    }

    // Update existing cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === args.productId
    );

    let updatedItems;
    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      updatedItems = cart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, qty: item.qty + args.qty }
          : item
      );
    } else {
      // Add new item
      updatedItems = [...cart.items, { productId: args.productId, qty: args.qty }];
    }

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: now,
    });
  },
});

export const updateQty = mutation({
  args: {
    productId: v.id("products"),
    qty: v.number(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    let cart;
    if (userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.productId === args.productId ? { ...item, qty: args.qty } : item
    );

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

export const removeItem = mutation({
  args: {
    productId: v.id("products"),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    let cart;
    if (userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart) return;

    const updatedItems = cart.items.filter(
      (item) => item.productId !== args.productId
    );

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

export const clear = mutation({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    let cart;
    if (userId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .unique();
    }

    if (!cart) return;

    return await ctx.db.patch(cart._id, {
      items: [],
      updatedAt: Date.now(),
    });
  },
});
