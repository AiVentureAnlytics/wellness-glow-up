import { Link, useLocation } from "react-router-dom";
import logoSrc from "@/assets/levelup-lockup.svg";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getCartCount } from "@/lib/cart";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="brand-gradient-bg text-primary-foreground text-center py-2.5 text-xs font-medium tracking-wide">
        Despacho a todo Chile &nbsp;·&nbsp; Envío gratis sobre $35.000 en RM &nbsp;·&nbsp; Importadores directos
      </div>

      <header
        className={`sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/60 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_2px_20px_hsl(222_25%_8%/0.07)]" : ""
        }`}
      >
        <div className="container flex items-center justify-between h-[68px]">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logoSrc} alt="Level Up" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/carrito"
              className="relative flex items-center gap-2 btn-primary text-sm h-10 px-5"
            >
              <ShoppingCart size={15} />
              <span className="hidden sm:inline">Carrito</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-foreground text-card text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
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
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-border/60 bg-card"
            >
              <div className="container py-3 flex flex-col gap-0.5">
                {links.map((l) => {
                  const active = location.pathname === l.to;
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
