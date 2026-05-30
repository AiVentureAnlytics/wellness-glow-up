import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Wearables from "./pages/Wearables";
import Suplementos from "./pages/Suplementos";
import Wellness from "./pages/Wellness";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import MercadoPagoCheckout from "./pages/MercadoPagoCheckout";
import PagoResultado from "./pages/PagoResultado";
import OrdenConfirmacion from "./pages/OrdenConfirmacion";
import ProductDetail from "./pages/ProductDetail";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/wearables" element={<Wearables />} />
              <Route path="/suplementos" element={<Suplementos />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pago/mercadopago" element={<MercadoPagoCheckout />} />
              <Route path="/pago/exito" element={<PagoResultado status="exito" />} />
              <Route path="/pago/error" element={<PagoResultado status="error" />} />
              <Route path="/pago/pendiente" element={<PagoResultado status="pendiente" />} />
              <Route path="/orden/:orderId" element={<OrdenConfirmacion />} />
              <Route path="/producto/:productId" element={<ProductDetail />} />
              <Route path="/admin/productos" element={<AuthProvider><ProductosAdmin /></AuthProvider>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
