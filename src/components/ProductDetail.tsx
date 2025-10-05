import { useQuery, useMutation } from "convex/react";
    import { api } from "../../convex/_generated/api";
    import { toast } from "sonner";

    type Page = "home" | "products" | "cart" | "product" | "about" | "contact";

    interface ProductDetailProps {
      slug: string;
      sessionId: string;
      onNavigate: (page: Page) => void;
    }

    export function ProductDetail({ slug, sessionId, onNavigate }: ProductDetailProps) {
      const product = useQuery(api.products.getBySlug, { slug });
      const addToCart = useMutation(api.cart.addItem);

      if (product === undefined) {
        return (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        );
      }

      if (product === null) {
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
              <p className="text-neutral-medium mb-8">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => onNavigate("products")}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        );
      }

      const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
      };

      const handleAddToCart = async () => {
        try {
          await addToCart({
            productId: product._id,
            qty: 1,
            sessionId,
          });
          toast.success("Added to cart!");
        } catch (error) {
          toast.error("Failed to add to cart");
        }
      };

      return (
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => onNavigate("products")}
            className="mb-6 text-primary hover:text-primary-dark flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <img
                src={product.bannerUrl || product.thumbnailUrl}
                alt={product.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block bg-secondary-light text-secondary-dark text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              
              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice(product.priceCents)}
              </div>

              <div className="prose prose-lg mb-8">
                <p>{product.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">What you'll learn:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-neutral-light text-neutral-dark px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Add to Cart
                </button>
                
                <div className="text-sm text-neutral-medium">
                  <p>✓ Instant digital delivery</p>
                  <p>✓ Lifetime access</p>
                  <p>✓ 30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Product Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Content</h3>
                <p className="text-neutral-medium">In-depth coverage of all essential topics</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Created</h3>
                <p className="text-neutral-medium">Developed by industry professionals</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Instant Access</h3>
                <p className="text-neutral-medium">Download immediately after purchase</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
