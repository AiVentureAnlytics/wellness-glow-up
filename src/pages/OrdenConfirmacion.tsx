import { useLocation, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdenConfirmacion() {
  const { orderId } = useParams();
  const { state } = useLocation() as {
    state: { customer: { name: string; email: string } } | null;
  };

  const firstName = state?.customer?.name?.split(" ")[0] ?? "Cliente";
  const email = state?.customer?.email ?? "";

  return (
    <div className="container py-20 max-w-xl text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 rounded-full p-6">
            <CheckCircle size={64} className="text-primary" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-black mb-2">
          ¡Gracias, {firstName}!
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Recibimos tu comprobante y estamos verificando tu pago.
        </p>

        <div className="bg-card rounded-2xl p-6 card-elevated text-left space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <Package size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Número de orden</p>
              <p className="text-sm text-muted-foreground font-mono break-all">{orderId}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">¿Qué sigue?</p>
              <p className="text-sm text-muted-foreground">
                Tu pago fue procesado exitosamente. Recibirás un email de confirmación en breve.
                {email && (
                  <> Te notificaremos a <strong>{email}</strong> cuando tu pedido sea confirmado y despachado.</>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/">Volver al inicio</Link>
          </Button>
          <Button asChild className="brand-gradient-bg text-primary-foreground rounded-full px-6 gap-2">
            <Link to="/suplementos">
              Seguir comprando
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
