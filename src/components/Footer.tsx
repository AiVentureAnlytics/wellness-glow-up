import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-black mb-3">
              VITRA<span className="text-primary">X</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Tu tienda de rendimiento, nutrición y bienestar.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Categorías</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/suplementos" className="hover:text-foreground transition-colors">Suplementos</Link>
              <Link to="/wearables" className="hover:text-foreground transition-colors">Wearables</Link>
              <Link to="/wellness" className="hover:text-foreground transition-colors">Wellness</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>contacto@vitrax.cl</p>
              <p>+56 9 1234 5678</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          © 2026 Vitrax. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
