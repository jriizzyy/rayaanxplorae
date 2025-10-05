import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 12;

    if (args.search) {
      let query;
      if (args.category) {
        query = ctx.db
          .query("products")
          .withSearchIndex("by_searchText", (q) =>
            q.search("searchText", args.search!)
             .eq("isPublished", true)
             .eq("category", args.category!)
          );
      } else {
        query = ctx.db
          .query("products")
          .withSearchIndex("by_searchText", (q) =>
            q.search("searchText", args.search!).eq("isPublished", true)
          );
      }
      return await query.take(limit);
    }

    if (args.category) {
      return await ctx.db
        .query("products")
        .withIndex("by_category_and_published", (q) =>
          q.eq("category", args.category!).eq("isPublished", true)
        )
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(limit);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    
    if (!product || !product.isPublished) {
      return null;
    }
    
    return product;
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .take(3);
    
    return products;
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    priceCents: v.number(),
    currency: v.string(),
    thumbnailUrl: v.string(),
    bannerUrl: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    digitalFileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const searchText = [args.title, args.description, ...args.tags].join(" ");
    
    return await ctx.db.insert("products", {
      ...args,
      searchText,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priceCents: v.optional(v.number()),
    currency: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    bannerUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    digitalFileUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Product not found");
    }

    const newTitle = updates.title ?? product.title;
    const newDescription = updates.description ?? product.description;
    const newTags = updates.tags ?? product.tags;
    const searchText = [newTitle, newDescription, ...newTags].join(" ");

    return await ctx.db.patch(id, {
      ...updates,
      searchText,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .collect();
    
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  },
});
