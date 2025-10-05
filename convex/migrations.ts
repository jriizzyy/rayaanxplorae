import { mutation } from "./_generated/server";

export const clearAndSeedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Clear existing data to prevent duplicates and dangling references
    const products = await ctx.db.query("products").collect();
    await Promise.all(products.map((p) => ctx.db.delete(p._id)));

    const carts = await ctx.db.query("carts").collect();
    await Promise.all(carts.map((c) => ctx.db.delete(c._id)));

    // 2. Seed new product data
    const now = Date.now();
    const productsToSeed = [
      {
        slug: "art-of-digital-marketing",
        title: "The Art of Digital Marketing",
        description: "Master the fundamentals of digital marketing with this comprehensive guide. Learn SEO, social media marketing, content strategy, and conversion optimization techniques that drive real results.",
        priceCents: 2900,
        currency: "usd",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        category: "Marketing",
        tags: ["digital marketing", "seo", "social media", "content strategy"],
        isPublished: true,
        digitalFileUrl: "https://example.com/files/digital-marketing.pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "web-development-fundamentals",
        title: "Web Development Fundamentals",
        description: "Build modern web applications from scratch. This course covers HTML, CSS, JavaScript, React, and backend development with Node.js. Perfect for beginners and intermediate developers.",
        priceCents: 3900,
        currency: "usd",
        thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
        bannerUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
        category: "Development",
        tags: ["web development", "javascript", "react", "nodejs", "html", "css"],
        isPublished: true,
        digitalFileUrl: "https://example.com/files/web-development.pdf",
        createdAt: now,
        updatedAt: now,
      },
      {
        slug: "data-science-essentials",
        title: "Data Science Essentials",
        description: "Dive into the world of data science with Python, pandas, NumPy, and machine learning. Learn to analyze data, create visualizations, and build predictive models.",
        priceCents: 4900,
        currency: "usd",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        bannerUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        category: "Data Science",
        tags: ["data science", "python", "machine learning", "pandas", "numpy"],
        isPublished: true,
        digitalFileUrl: "https://example.com/files/data-science.pdf",
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const product of productsToSeed) {
      const searchText = [product.title, product.description, ...product.tags].join(" ");
      await ctx.db.insert("products", { ...product, searchText });
    }
  },
});
