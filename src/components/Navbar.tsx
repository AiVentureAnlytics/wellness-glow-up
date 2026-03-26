import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getCartCount } from "@/lib/cart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/wearables", label: "Wearables" },
  { to: "/suplementos", label: "Suplementos" },
  { to: "/wellness", label: "Wellness" },
];

export default function Navbar() {
  const cart = useCart();
  const count = getCartCount(cart);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top banner */}
      <div className="brand-gradient-bg text-primary-foreground text-center py-2 text-sm font-semibold tracking-wide">
        🚚 Despacho a todo Chile 🇨🇱
      </div>

      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-2xl font-black tracking-tight">
            VITRA<span className="text-primary">X</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/carrito"
              className="relative brand-gradient-bg text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={16} />
              Carrito
              {count > 0 && (
                <span className="bg-card text-primary text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t bg-card"
            >
              <div className="container py-4 flex flex-col gap-2">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium ${
                      location.pathname === l.to
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
