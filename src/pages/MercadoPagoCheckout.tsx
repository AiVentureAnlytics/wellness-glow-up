import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatCLP, CartItem } from "@/lib/cart";
import { createPreference, isMPConfigured, isMPTestMode } from "@/lib/mercadopago";
import { cleanRut } from "@/lib/rut";
import { validateCartStock } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, ExternalLink, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface CheckoutState {
  customer: { name: string; email: string; phone: string; rut?: string; address: string; commune_id?: number; commune_name?: string };
  cart: CartItem[];
  total: number;
  shippingCost?: number;
  courierName?: string | null;
}

export default function MercadoPagoCheckout() {
  const { state } = useLocation() as { state: CheckoutState | null };
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state) navigate("/carrito");
  }, [state, navigate]);

  if (!state) return null;

  const { customer, cart, total, shippingCost = 3000, courierName } = state;

  async function handlePay() {
    setError("");
    setProcessing(true);
    try {
      // 1. Validar stock antes de crear la orden
      const stockErrors = await validateCartStock(cart);
      if (stockErrors.length > 0) {
        const detail = stockErrors
          .map((e) =>
            e.available === 0
              ? `${e.productName} sin stock`
              : `${e.productName} (disponible: ${e.available})`
          )
          .join(", ");
        throw new Error(`Stock insuficiente: ${detail}`);
      }

      // 3. Crear la orden en Supabase
      // UUID generado en cliente: evita .select() tras INSERT
      // (.select() activa RETURNING * que requiere SELECT policy — ahora restringida)
      const orderId = crypto.randomUUID();

      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          status: "pendiente_pago",
          total,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_rut: customer.rut ? cleanRut(customer.rut) : null,
          customer_address: customer.address,
          shipping_commune_id: customer.commune_id,
          shipping_commune_name: customer.commune_name,
          payment_method: "mercadopago",
          shipping_cost: shippingCost ?? 0,
        });

      if (orderError) throw new Error(orderError.message);

      const items = cart.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) throw new Error(itemsError.message);

      // 4. Crear preferencia MercadoPago
      const pref = await createPreference({ cart, customer, orderId, shippingCost });

      // 5. Guardar ID de orden y redirigir — el carrito se limpia en /pago/exito
      sessionStorage.setItem("pending_order_id", orderId);

      // Usar sandbox en TEST, init_point real en PROD
      const redirectUrl = isMPTestMode() ? pref.sandbox_init_point : pref.init_point;
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      toast.error("Hubo un problema al procesar el pago.");
      setProcessing(false);
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Pasos */}
        <div className="flex items-center gap-2 mb-8 text-sm flex-wrap">
          <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</span>
          <span className="text-muted-foreground">Tus datos</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
          <span className="font-semibold text-primary">Pagar</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          <span className="text-muted-foreground">Confirmación</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Finalizar pago</h1>
        <p className="text-muted-foreground mb-6">Pagas seguro con MercadoPago. Acepta tarjetas, débito y saldo MP.</p>

        {/* Total */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
          <p className="font-display text-4xl font-black text-primary">{formatCLP(total)}</p>
        </div>

        {/* Resumen carrito */}
        <div className="bg-card border rounded-2xl p-6 card-elevated mb-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <ShoppingBag size={18} /> Tu pedido
          </h3>
          <div className="space-y-2 text-sm">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">{item.name} × {item.qty}</span>
                <span className="font-semibold">{formatCLP(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t pt-2">
              {shippingCost === 0 ? (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Envío</span>
                  <span>Envío gratis 🎉</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">{formatCLP(shippingCost)}</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            🕐 Tiempo de entrega: 3 días hábiles
          </p>
        </div>

        {/* MP card */}
        <div className="bg-card border rounded-2xl p-6 card-elevated mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#009EE3] rounded-xl p-2.5">
              <CreditCard size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold">MercadoPago</h3>
              <p className="text-xs text-muted-foreground">Pago seguro encriptado</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Visa", "Mastercard", "American Express", "Débito", "Saldo MP"].map((m) => (
              <span key={m} className="text-xs font-semibold bg-muted px-3 py-1 rounded-full">{m}</span>
            ))}
          </div>

          {!isMPConfigured() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-900 mb-4 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>
                VITE_MP_PUBLIC_KEY no configurada. Agrega las credenciales al .env.
              </span>
            </div>
          )}

          {isMPTestMode() && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 mb-4 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>
                Modo TEST — Usa las <a href="https://www.mercadopago.cl/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards" target="_blank" rel="noopener noreferrer" className="underline font-semibold">tarjetas de prueba de MP</a> para simular pagos.
              </span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm mb-4 flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            onClick={handlePay}
            disabled={processing || !isMPConfigured()}
            className="w-full h-14 text-lg font-semibold rounded-full gap-2 bg-[#009EE3] hover:bg-[#0088cc] text-white disabled:opacity-50"
          >
            {processing ? (
              <><Loader2 size={20} className="animate-spin" /> Procesando…</>
            ) : (
              <><ExternalLink size={20} /> Pagar {formatCLP(total)}</>
            )}
          </Button>
        </div>

      </motion.div>
    </div>
  );
}
