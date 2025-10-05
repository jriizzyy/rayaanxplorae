type Page = "home" | "products" | "cart" | "product" | "about" | "contact";

    interface FooterProps {
      onNavigate: (page: Page) => void;
    }

    export function Footer({ onNavigate }: FooterProps) {
      return (
        <footer className="bg-neutral-dark text-neutral-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <h3 className="text-xl font-bold mb-4">RayaanXplorAE</h3>
                <p className="text-neutral-light">
                  Premium digital products for professional growth and learning.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => onNavigate("home")}
                      className="text-secondary-light hover:text-secondary transition-colors"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("products")}
                      className="text-secondary-light hover:text-secondary transition-colors"
                    >
                      Products
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate("about")}
                      className="text-secondary-light hover:text-secondary transition-colors"
                    >
                      About Us
                    </button>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h4 className="font-semibold mb-4">Customer Service</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => onNavigate("contact")}
                      className="text-secondary-light hover:text-secondary transition-colors"
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-light hover:text-secondary transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-light hover:text-secondary transition-colors">
                      Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-secondary-light hover:text-secondary transition-colors">
                      Returns
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Us */}
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-2 text-neutral-light">
                  <li>support@rayaanxplorae.com</li>
                  <li>+1 (555) 123-4567</li>
                  <li>Mon-Fri: 9 AM - 6 PM EST</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-neutral-medium mt-8 pt-8 text-center text-neutral-light">
              <p>&copy; 2024 RayaanXplorAE. All rights reserved.</p>
            </div>
          </div>
        </footer>
      );
    }
