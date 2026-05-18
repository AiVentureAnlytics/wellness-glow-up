import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { clearCart, formatCLP } from "@/lib/cart";
import { validateCartStock } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, CheckCircle, Copy, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const BANK_INFO = {
  Banco: "Banco Santander",
  "Tipo de cuenta": "Cuenta Corriente",
  "Número de cuenta": "0123456789",
  RUT: "76.123.456-7",
  Titular: "AVA SpA (CJ Health Supply)",
  Email: "cjhealthsupply@gmail.com",
};

export default function Transferencia() {
  const { state } = useLocation() as {
    state: {
      customer: { name: string; email: string; phone: string; address: string };
      cart: { id: string; name: string; price: number; img: string; qty: number }[];
      total: number;
    } | null;
  };
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!state) {
    navigate("/carrito");
    return null;
  }

  const { customer, cart, total } = state;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  }

  async function handleTransferencia() {
    if (!file) {
      setError("Adjunta el comprobante para continuar.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      // 1. Validar stock
      const stockErrors = await validateCartStock(cart);
      if (stockErrors.length > 0) {
        const detail = stockErrors
          .map((e) =>
            e.available === 0
              ? `${e.productName} sin stock`
              : `${e.productName} (disponible: ${e.available})`
          )
          .join(", ");
        setError(`Stock insuficiente: ${detail}`);
        setUploading(false);
        return;
      }

      // 2. Subir comprobante
      const ext = file.name.split(".").pop();
      const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("comprobantes")
        .upload(filename, file, { contentType: file.type });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage.from("comprobantes").getPublicUrl(filename);

      // 3. Crear orden en Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          status: "pendiente_verificacion",
          total,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          customer_address: customer.address,
          payment_method: "transferencia",
          payment_proof_url: urlData.publicUrl,
        })
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        qty: item.qty,
        img_url: item.img,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(items);
      if (itemsError) throw new Error(itemsError.message);

      // 4. Decrementar stock (idempotente — seguro si se llama más de una vez)
      const { error: rpcError } = await supabase.rpc("decrement_order_stocks", {
        p_order_id: order.id,
      });
      if (rpcError) throw new Error(rpcError.message);

      clearCart();
      navigate(`/orden/${order.id}`, { state: { order, customer } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      toast.error("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Pasos */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">✓</span>
          <span className="text-muted-foreground">Tus datos</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
          <span className="font-semibold text-primary">Pagar</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          <span className="text-muted-foreground">Confirmación</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Transferencia bancaria</h1>
        <p className="text-muted-foreground mb-6">Transfiere el monto y sube tu comprobante para confirmar el pedido.</p>

        {/* Monto */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-1">Total a transferir</p>
          <p className="font-display text-4xl font-black text-primary">{formatCLP(total)}</p>
        </div>

        {/* Datos bancarios */}
        <div className="bg-card rounded-2xl p-6 card-elevated mb-4">
          <h2 className="font-display font-bold text-base mb-4">Datos para transferir</h2>
          {Object.entries(BANK_INFO).map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{value}</span>
                <button
                  onClick={() => copyToClipboard(value, label)}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={`Copiar ${label}`}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subir comprobante */}
        <div className="bg-card rounded-2xl p-6 card-elevated mb-4">
          <h2 className="font-display font-bold text-base mb-4">Adjuntar comprobante</h2>
          <label
            htmlFor="comprobante"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            {file ? (
              <>
                <CheckCircle size={28} className="text-primary mb-2" />
                <p className="text-sm font-semibold text-primary">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Clic para cambiar</p>
              </>
            ) : (
              <>
                <Upload size={28} className="text-muted-foreground mb-2" />
                <p className="text-sm font-semibold">PNG, JPG o PDF · Máx 10MB</p>
              </>
            )}
            <input
              id="comprobante"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f && f.size > 10 * 1024 * 1024) { setError("El archivo no puede superar 10MB."); return; }
                if (f) { setFile(f); setError(""); }
              }}
            />
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3 mb-4">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Button
          onClick={handleTransferencia}
          disabled={uploading}
          className="w-full brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2"
        >
          {uploading ? (
            <><Loader2 size={20} className="animate-spin" /> Subiendo...</>
          ) : (
            <><CheckCircle size={20} /> Confirmar pago</>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Verificamos tu transferencia en máx. 24h hábiles.
        </p>
      </motion.div>
    </div>
  );
}
