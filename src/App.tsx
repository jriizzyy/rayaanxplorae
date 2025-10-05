import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { ProductDetail } from "./components/ProductDetail";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

type Page = "home" | "products" | "cart" | "product" | "about" | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const clearAndSeed = useMutation(api.migrations.clearAndSeedDatabase);

  useEffect(() => {
    // Generate session ID for guest users
    let storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("sessionId", storedSessionId);
    }
    setSessionId(storedSessionId);

    // Seed products on first load
    const hasSeeded = localStorage.getItem("hasSeeded");
    if (!hasSeeded) {
      clearAndSeed().then(() => {
        localStorage.setItem("hasSeeded", "true");
      }).catch(console.error);
    }
  }, [clearAndSeed]);

  const navigateTo = (page: Page, productSlug?: string) => {
    setCurrentPage(page);
    if (productSlug) {
      setSelectedProductSlug(productSlug);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-light">
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      
      <main className="flex-1">
        <Content 
          currentPage={currentPage} 
          onNavigate={navigateTo}
          selectedProductSlug={selectedProductSlug}
          sessionId={sessionId}
        />
      </main>
      
      <Footer onNavigate={navigateTo} />
      <Toaster />
    </div>
  );
}

function Content({ 
  currentPage, 
  onNavigate, 
  selectedProductSlug, 
  sessionId 
}: { 
  currentPage: Page;
  onNavigate: (page: Page, productSlug?: string) => void;
  selectedProductSlug: string;
  sessionId: string;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (currentPage === "home") {
    return <HomePage onNavigate={onNavigate} />;
  }

  if (currentPage === "products") {
    return <ProductsPage onNavigate={onNavigate} />;
  }

  if (currentPage === "cart") {
    return <Cart sessionId={sessionId} onNavigate={onNavigate} />;
  }

  if (currentPage === "product") {
    return (
      <ProductDetail 
        slug={selectedProductSlug} 
        sessionId={sessionId}
        onNavigate={onNavigate}
      />
    );
  }

  if (currentPage === "about") {
    return <AboutPage />;
  }

  if (currentPage === "contact") {
    return <ContactPage />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to RayaanXplorAE</h1>
          <SignInForm />
        </div>
      </Unauthenticated>
      
      <Authenticated>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
          <p className="text-xl text-neutral-medium mb-8">
            Hello, {loggedInUser?.email}
          </p>
        </div>
      </Authenticated>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (page: Page, productSlug?: string) => void }) {
  const featuredProducts = useQuery(api.products.getFeatured) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-neutral-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">RayaanXplorAE</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover premium digital products to accelerate your learning and career growth
          </p>
          <button
            onClick={() => onNavigate("products")}
            className="bg-secondary text-neutral-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary-dark transition-colors"
          >
            Explore Products
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewProduct={(slug) => onNavigate("product", slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-neutral-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Latest Products</h2>
          <p className="text-neutral-medium mb-8 max-w-2xl mx-auto">
            Get notified when we release new digital products and exclusive offers
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ onNavigate }: { onNavigate: (page: Page, productSlug?: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const products = useQuery(api.products.list, {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
  }) || [];
  
  const categories = useQuery(api.products.getCategories) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Digital Products</h1>
      
      {/* Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onViewProduct={(slug) => onNavigate("product", slug)}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-medium text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About RayaanXplorAE</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-neutral-medium mb-6">
            RayaanXplorAE is your premier destination for high-quality digital products 
            designed to accelerate your professional growth and learning journey.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            We believe in democratizing access to premium educational content and tools. 
            Our carefully curated collection of digital products spans across marketing, 
            development, data science, and more, ensuring there's something valuable for 
            every professional.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Expert-created content by industry professionals</li>
            <li>Instant digital delivery after purchase</li>
            <li>Lifetime access to your purchased products</li>
            <li>Regular updates and new content additions</li>
            <li>Dedicated customer support</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Products</h2>
          <p className="mb-6">
            From comprehensive marketing guides to in-depth technical tutorials, 
            our products are designed to provide practical, actionable knowledge 
            that you can apply immediately in your career or business.
          </p>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Send Message
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-2">
              <p><strong>Email:</strong> support@rayaanxplorae.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
