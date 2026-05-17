import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase, Order } from "@/lib/supabase";
import { formatCLP } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Loader2, Package, ShoppingBag } from "lucide-react";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pendiente_pago: { label: "Pendiente de pago", color: "bg-yellow-100 text-yellow-800" },
  pendiente_verificacion: { label: "Verificando pago", color: "bg-blue-100 text-blue-800" },
  verificado: { label: "Pago verificado", color: "bg-green-100 text-green-800" },
  enviado: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  entregado: { label: "Entregado", color: "bg-emerald-100 text-emerald-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function MisOrdenes() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", user!.email)
        .order("created_at", { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      setLoading(false);
    }
    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 size={32} className="animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 max-w-md text-center">
        <Package size={64} className="mx-auto text-muted-foreground/40 mb-4" />
        <h1 className="font-display text-2xl font-bold">Inicia sesión para ver tus órdenes</h1>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/login">Ingresar</Link>
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-20 max-w-md text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/40 mb-4" />
        <h1 className="font-display text-2xl font-bold">Aún no tienes órdenes</h1>
        <p className="text-muted-foreground mt-2">Cuando hagas tu primera compra, aparecerá acá.</p>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/suplementos">Ver suplementos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold mb-8"
      >
        Mis órdenes
      </motion.h1>

      <div className="space-y-4">
        {orders.map((order, i) => {
          const status = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-muted text-foreground" };
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border rounded-xl p-5 card-elevated"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-muted-foreground">Orden</p>
                  <p className="font-mono text-sm font-semibold">{order.id.slice(0, 8)}…</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(order.created_at).toLocaleDateString("es-CL", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold">{formatCLP(order.total)}</p>
                  <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-end">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link to={`/orden/${order.id}`}>Ver detalle</Link>
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
