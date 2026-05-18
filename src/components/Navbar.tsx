import { Link, useLocation, useNavigate } from "react-router-dom";
import logoSrc from "@/assets/levelup-lockup.png";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getCartCount } from "@/lib/cart";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  }

  return (
    <>
      {/* Top banner */}
      <div className="brand-gradient-bg text-primary-foreground text-center py-2 text-sm font-semibold tracking-wide">
        🚚 Despacho a todo Chile 🇨🇱 — Envío gratis sobre $40.000
      </div>

      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b">
        <div className="container flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center">
            <img src={logoSrc} alt="Level Up" className="h-10 w-auto shrink-0 md:h-12" />
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

          <div className="flex items-center gap-2">
            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-muted text-foreground hover:bg-muted/80 transition-colors">
                  <User size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-muted-foreground">Conectado como</p>
                    <p className="text-sm font-semibold truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/mis-ordenes")}>
                    Mis órdenes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut size={14} className="mr-2" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <User size={14} /> Ingresar
              </Link>
            )}

            <Link
              to="/carrito"
              className="relative brand-gradient-bg text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Carrito</span>
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
                <div className="border-t pt-2 mt-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-xs text-muted-foreground">{user.email}</div>
                      <button
                        onClick={() => { handleSignOut(); setOpen(false); }}
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-muted"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                    >
                      Ingresar / Crear cuenta
                    </Link>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
