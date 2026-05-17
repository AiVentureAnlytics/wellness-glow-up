import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { clearCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, ShoppingBag, Home, Package } from "lucide-react";

type Status = "exito" | "error" | "pendiente";

const COPY: Record<Status, { icon: typeof CheckCircle; title: string; desc: string; color: string; bg: string }> = {
  exito: {
    icon: CheckCircle,
    title: "¡Pago aprobado!",
    desc: "Tu orden fue confirmada. Te enviaremos un email con el detalle y el seguimiento.",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
  },
  error: {
    icon: XCircle,
    title: "El pago no se completó",
    desc: "No pudimos procesar tu pago. Tu carrito sigue guardado — puedes intentar de nuevo.",
    color: "text-destructive",
    bg: "bg-red-50 border-red-200",
  },
  pendiente: {
    icon: Clock,
    title: "Pago pendiente",
    desc: "MercadoPago aún está procesando tu pago. Te notificaremos cuando se confirme.",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
  },
};

// MP status → order status mapping
const ORDER_STATUS: Record<Status, string> = {
  exito: "verificado",
  error: "cancelado",
  pendiente: "pendiente_pago",
};

export default function PagoResultado({ status }: { status: Status }) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const orderId = params.get("order") ?? sessionStorage.getItem("pending_order_id");
  useEffect(() => {
    async function updateStatus() {
      if (!orderId) return;

      await supabase
        .from("orders")
        .update({ status: ORDER_STATUS[status] })
        .eq("id", orderId);

      if (status === "exito") {
        clearCart();
        sessionStorage.removeItem("pending_order_id");
      }
    }
    updateStatus();
  }, [orderId, status]);

  const { icon: Icon, title, desc, color, bg } = COPY[status];

  return (
    <div className="container py-20 max-w-md text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div className={`${bg} border rounded-3xl p-8`}>
          <Icon size={64} className={`mx-auto ${color} mb-4`} />
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-3">{desc}</p>
          {orderId && (
            <p className="text-xs font-mono text-muted-foreground mt-4">
              Orden #{orderId.slice(0, 8)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-6">
          {status === "exito" && orderId && (
            <Button asChild className="brand-gradient-bg text-primary-foreground rounded-full h-12">
              <Link to={`/orden/${orderId}`}>
                <Package size={16} className="mr-2" /> Ver mi orden
              </Link>
            </Button>
          )}
          {status === "error" && (
            <Button asChild className="brand-gradient-bg text-primary-foreground rounded-full h-12">
              <Link to="/carrito">
                <ShoppingBag size={16} className="mr-2" /> Volver al carrito
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" className="rounded-full h-12">
            <Link to="/">
              <Home size={16} className="mr-2" /> Ir al inicio
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
