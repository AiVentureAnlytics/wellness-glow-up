import { Link } from "react-router-dom";
import logoSrc from "@/assets/levelup-lockup.png";
import { Mail, MessageCircle, Instagram, Shield, Truck, CreditCard } from "lucide-react";

const trustItems = [
  { icon: Truck, label: "Envío a todo Chile" },
  { icon: Shield, label: "Pago 100% seguro" },
  { icon: CreditCard, label: "Cuotas sin interés" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card mt-24">
      {/* Trust strip */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full brand-gradient-bg flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logoSrc} alt="Level Up" className="h-9 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Distribución oficial de suplementos, wearables y wellness en Chile.
              Importadores directos desde Europa y EE.UU.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://wa.me/56945530873"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://instagram.com/levelup.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:cjhealthsupply@gmail.com"
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Tienda</p>
            <div className="flex flex-col gap-2.5">
              {[
                { to: "/suplementos", label: "Suplementos" },
                { to: "/wearables", label: "Wearables" },
                { to: "/wellness", label: "Wellness" },
                { to: "/carrito", label: "Mi carrito" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Información</p>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <span>Despacho en 24–72 h</span>
              <span>Envío gratis sobre $40.000</span>
              <span>Productos importados directos</span>
              <span>Santiago, Chile</span>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contacto</p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:cjhealthsupply@gmail.com"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={14} className="shrink-0" />
                cjhealthsupply@gmail.com
              </a>
              <a
                href="https://wa.me/56945530873"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle size={14} className="shrink-0" />
                +56 9 4553 0873
              </a>
              <a
                href="https://wa.me/56953001483"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle size={14} className="shrink-0" />
                +56 9 5300 1483
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <span>© 2026 Level Up / AVA S.A. — Santiago, Chile</span>
          <span>Productos sin pretensión médica. Consulta a tu profesional de salud.</span>
        </div>
      </div>
    </footer>
  );
}
