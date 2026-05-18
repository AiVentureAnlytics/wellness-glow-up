import { Link } from "react-router-dom";
import logoMark from "@/assets/levelup-mark.svg";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-4">
              <img src={logoMark} alt="Level Up" className="h-12" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Distribución oficial de suplementos, wearables y wellness en Chile. Importadores directos.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Tienda</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/suplementos" className="hover:text-foreground transition-colors">Suplementos</Link>
              <Link to="/wearables" className="hover:text-foreground transition-colors">Wearables</Link>
              <Link to="/wellness" className="hover:text-foreground transition-colors">Wellness</Link>
              <Link to="/carrito" className="hover:text-foreground transition-colors">Mi carrito</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Cuenta</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/login" className="hover:text-foreground transition-colors">Ingresar</Link>
              <Link to="/registro" className="hover:text-foreground transition-colors">Crear cuenta</Link>
              <Link to="/mis-ordenes" className="hover:text-foreground transition-colors">Mis órdenes</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:cjhealthsupply@gmail.com" className="flex items-center gap-2 hover:text-foreground">
                <Mail size={14} /> cjhealthsupply@gmail.com
              </a>
              <a href="https://wa.me/56945530873" className="flex items-center gap-2 hover:text-foreground">
                <Phone size={14} /> +56 9 4553 0873
              </a>
              <a href="https://wa.me/56953001483" className="flex items-center gap-2 hover:text-foreground">
                <Phone size={14} /> +56 9 5300 1483
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <span>© 2026 Level Up / AVA S.A. — Santiago, Chile</span>
          <span>Productos sin pretensión médica. Consulta a tu profesional de salud.</span>
        </div>
      </div>
    </footer>
  );
}
