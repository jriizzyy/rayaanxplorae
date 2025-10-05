import { useQuery } from "convex/react";
    import { api } from "../../convex/_generated/api";
    import { SignOutButton } from "../SignOutButton";

    type Page = "home" | "products" | "cart" | "product" | "about" | "contact";

    interface HeaderProps {
      currentPage: Page;
      onNavigate: (page: Page) => void;
    }

    export function Header({ currentPage, onNavigate }: HeaderProps) {
      const loggedInUser = useQuery(api.auth.loggedInUser);

      return (
        <header className="bg-primary text-neutral-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <button
                onClick={() => onNavigate("home")}
                className="text-2xl font-bold hover:opacity-90 transition-opacity"
              >
                RayaanXplorAE
              </button>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => onNavigate("home")}
                  className={`font-medium transition-colors ${
                    currentPage === "home"
                      ? "text-neutral-white"
                      : "text-neutral-light hover:text-neutral-white"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => onNavigate("products")}
                  className={`font-medium transition-colors ${
                    currentPage === "products"
                      ? "text-neutral-white"
                      : "text-neutral-light hover:text-neutral-white"
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => onNavigate("about")}
                  className={`font-medium transition-colors ${
                    currentPage === "about"
                      ? "text-neutral-white"
                      : "text-neutral-light hover:text-neutral-white"
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => onNavigate("contact")}
                  className={`font-medium transition-colors ${
                    currentPage === "contact"
                      ? "text-neutral-white"
                      : "text-neutral-light hover:text-neutral-white"
                  }`}
                >
                  Contact
                </button>
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate("cart")}
                  className={`relative p-2 rounded-lg transition-colors ${
                    currentPage === "cart"
                      ? "bg-primary-dark text-neutral-white"
                      : "text-neutral-light hover:text-neutral-white hover:bg-primary-dark"
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                  </svg>
                </button>
                
                {loggedInUser ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-light">
                      {loggedInUser.email}
                    </span>
                    <SignOutButton />
                  </div>
                ) : (
                  <div className="text-sm text-neutral-light">
                    Guest
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      );
    }
