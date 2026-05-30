import { useCart } from "@/hooks/useCart";
import { removeFromCart, changeQuantity, getCartTotal, formatCLP, getShippingCost, getOrderTotal, SHIPPING_THRESHOLD } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Carrito() {
  const cart = useCart();
  const subtotal = getCartTotal(cart);
  const shippingCost = getShippingCost(subtotal);
  const orderTotal = getOrderTotal(subtotal);

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30" />
        <h1 className="font-display text-2xl font-bold mt-6">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mt-2">Agrega productos para continuar.</p>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/suplementos">Ver Suplementos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-3xl font-bold mb-8">Tu Carrito</h1>
      <AnimatePresence>
        {cart.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center gap-4 bg-card rounded-xl p-4 mb-3 card-elevated"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-20 h-20 shrink-0 rounded-lg object-cover overflow-hidden"
              loading="lazy"
              width={80}
              height={80}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{formatCLP(item.price)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => changeQuantity(item.id, -1)}
                >
                  <Minus size={14} />
                </Button>
                <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => changeQuantity(item.id, 1)}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{formatCLP(item.price * item.qty)}</p>
              <Button
                variant="ghost"
                size="icon"
                className="mt-1 text-destructive hover:text-destructive"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="mt-8 bg-card rounded-xl p-6 card-elevated space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        {shippingCost === 0 ? (
          <div className="flex justify-between items-center text-sm text-green-600 font-semibold">
            <span>Envío</span>
            <span>Envío gratis 🎉</span>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span>{formatCLP(shippingCost)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              Te faltan {formatCLP(SHIPPING_THRESHOLD - subtotal)} para envío gratis
            </p>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between items-center">
          <span className="font-display text-xl font-bold">Total</span>
          <span className="font-display text-2xl font-bold text-primary">{formatCLP(orderTotal)}</span>
        </div>
        <Button
          asChild
          className="w-full brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2"
        >
          <Link to="/checkout">
            <CreditCard size={20} />
            Pagar ahora
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Lock size={12} /> Pago seguro · Despacho a todo Chile 🇨🇱
        </p>
      </div>
    </div>
  );
}
