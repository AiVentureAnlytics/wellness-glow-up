import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { getCartTotal, formatCLP, getShippingCost, getOrderTotal, SHIPPING_THRESHOLD } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, ArrowRight, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const cart = useCart();
  const subtotal = getCartTotal(cart);
  const shippingCost = getShippingCost(subtotal);
  const orderTotal = getOrderTotal(subtotal);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30" />
        <h1 className="font-display text-2xl font-bold mt-6">Tu carrito está vacío</h1>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/suplementos">Ver Suplementos</Link>
        </Button>
      </div>
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim()) e.phone = "Ingresa tu teléfono";
    if (!form.address.trim()) e.address = "Ingresa tu dirección de despacho";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    navigate("/pago/mercadopago", { state: { customer: form, cart, total: orderTotal } });
  }

  return (
    <div className="container py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Pasos */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
          <span className="font-semibold text-primary">Tus datos</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
          <span className="text-muted-foreground">Pagar</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          <span className="text-muted-foreground">Confirmación</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-8">Datos de envío</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User size={14} /> Nombre completo
            </Label>
            <Input
              id="name"
              placeholder="Ej: María González"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={14} /> Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={14} /> Teléfono
            </Label>
            <Input
              id="phone"
              placeholder="+56 9 1234 5678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin size={14} /> Dirección de despacho
            </Label>
            <Input
              id="address"
              placeholder="Calle, número, ciudad, región"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* Resumen */}
          <div className="bg-muted/50 rounded-xl p-4 mt-6 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Resumen del pedido</p>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span>{formatCLP(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
              <span>Subtotal</span>
              <span>{formatCLP(subtotal)}</span>
            </div>
            {shippingCost === 0 ? (
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <span>Envío</span>
                <span>Envío gratis 🎉</span>
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{formatCLP(shippingCost)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  Te faltan {formatCLP(SHIPPING_THRESHOLD - subtotal)} para envío gratis
                </p>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCLP(orderTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              🕐 Tiempo de entrega: máximo 2 semanas
            </p>
          </div>

          <Button
            type="submit"
            className="w-full brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2 mt-4"
          >
            Continuar al pago
            <ArrowRight size={20} />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
