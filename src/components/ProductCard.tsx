import { Doc } from "../../convex/_generated/dataModel";

    interface ProductCardProps {
      product: Doc<"products">;
      onViewProduct: (slug: string) => void;
    }

    export function ProductCard({ product, onViewProduct }: ProductCardProps) {
      const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
      };

      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="mb-2">
              <span className="inline-block bg-secondary-light text-secondary-dark text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
            <p className="text-neutral-medium mb-4 line-clamp-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.priceCents)}
              </span>
              <button
                onClick={() => onViewProduct(product.slug)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      );
    }
