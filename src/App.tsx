import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Wearables = lazy(() => import("./pages/Wearables"));
const Suplementos = lazy(() => import("./pages/Suplementos"));
const Wellness = lazy(() => import("./pages/Wellness"));
const Carrito = lazy(() => import("./pages/Carrito"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MercadoPagoCheckout = lazy(() => import("./pages/MercadoPagoCheckout"));
const PagoResultado = lazy(() => import("./pages/PagoResultado"));
const OrdenConfirmacion = lazy(() => import("./pages/OrdenConfirmacion"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ProductosAdmin = lazy(() => import("./pages/admin/ProductosAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense>
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
                <Route
                  path="/admin/productos"
                  element={
                    <Suspense fallback={<div className="container py-20 text-center text-muted-foreground">Cargando…</div>}>
                      <AuthProvider><ProductosAdmin /></AuthProvider>
                    </Suspense>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
