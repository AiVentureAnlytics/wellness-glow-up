import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import helioImg from "@/assets/helio-strap.jpg";

export default function Wearables() {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addToCart("helio-01", "Amazfit Helio Strap", 140000, helioImg, qty);
    toast.success(`Helio Strap (x${qty}) agregado al carrito`);
    setQty(1);
  };

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl p-6 card-elevated"
        >
          <img src={helioImg} alt="Helio Strap" className="w-full rounded-xl" width={800} height={800} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            <Star size={12} /> NUEVO
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">Amazfit Helio Strap</h1>
          <p className="text-muted-foreground mt-3">
            Wearable sin pantalla para enfocarse en datos extremos, recuperación y entrenamiento.
          </p>
          <p className="text-3xl font-bold text-primary mt-6">$140.000 CLP</p>

          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus size={16} />
            </Button>
            <span className="text-lg font-bold w-8 text-center">{qty}</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setQty(qty + 1)}
            >
              <Plus size={16} />
            </Button>
          </div>

          <Button
            onClick={handleAdd}
            className="w-full mt-6 brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2"
          >
            <ShoppingCart size={20} />
            Agregar al carrito
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
