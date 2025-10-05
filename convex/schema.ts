import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  products: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    priceCents: v.number(),
    currency: v.string(),
    thumbnailUrl: v.string(),
    bannerUrl: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    isPublished: v.boolean(),
    digitalFileUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    searchText: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_category_and_published", ["category", "isPublished"])
    .index("by_published", ["isPublished"])
    .searchIndex("by_searchText", {
      searchField: "searchText",
      filterFields: ["category", "isPublished"],
    }),

  carts: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    items: v.array(v.object({
      productId: v.id("products"),
      qty: v.number(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  orders: defineTable({
    userId: v.optional(v.id("users")),
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
    paymentStatus: v.string(),
    downloadTokens: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_session", ["stripeSessionId"])
    .index("by_email", ["email"]),

  downloads: defineTable({
    token: v.string(),
    productId: v.id("products"),
    orderId: v.id("orders"),
    email: v.string(),
    expiresAt: v.number(),
    usedAt: v.optional(v.number()),
  })
    .index("by_token", ["token"])
    .index("by_order", ["orderId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
