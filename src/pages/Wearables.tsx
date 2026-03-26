import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";
import helioImg from "@/assets/helio-strap.jpg";
import helioAction from "@/assets/helio-strap-action.webp";
import helioBox from "@/assets/helio-strap-box.webp";
import strapOrange from "@/assets/strap-orange.jpg";
import strapGreen from "@/assets/strap-green.jpg";
import strapBlack from "@/assets/strap-black.jpg";

const images = [helioImg, helioAction, helioBox];

const straps = [
  {
    id: "strap-orange",
    name: "Correa Sport Naranja",
    price: 15000,
    priceLabel: "$15.000",
    img: strapOrange,
    desc: "Silicona deportiva, resistente al agua.",
  },
  {
    id: "strap-green",
    name: "Correa Táctica Verde",
    price: 18000,
    priceLabel: "$18.000",
    img: strapGreen,
    desc: "Tejido militar transpirable, estilo outdoor.",
  },
  {
    id: "strap-black",
    name: "Correa Cuero Negro",
    price: 22000,
    priceLabel: "$22.000",
    img: strapBlack,
    desc: "Cuero premium, look elegante y sofisticado.",
  },
];

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}

export default function Wearables() {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const handleAdd = () => {
    addToCart("helio-01", "Amazfit Helio Strap", 140000, helioImg, qty);
    toast.success(`Helio Strap (x${qty}) agregado al carrito`);
    setQty(1);
  };

  const handleAddStrap = (s: typeof straps[0]) => {
    addToCart(s.id, s.name, s.price, s.img);
    toast.success(`${s.name} agregado al carrito`);
  };

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-card rounded-2xl p-6 card-elevated">
            <img src={images[activeImg]} alt="Helio Strap" className="w-full rounded-xl aspect-square object-cover" width={800} height={800} />
          </div>
          <div className="flex gap-3 mt-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImg === i ? "border-primary ring-2 ring-primary/20" : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
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

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Truck size={16} className="text-primary shrink-0" />
            <span>Llega el <strong className="text-foreground">{getDeliveryDate()}</strong> · Despacho a todo Chile 🇨🇱</span>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
              <Minus size={16} />
            </Button>
            <span className="text-lg font-bold w-8 text-center">{qty}</span>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(qty + 1)}>
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

      {/* Accesorios / Correas extra */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
          Correas <span className="brand-gradient-text">compatibles</span>
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {straps.map((s) => (
            <div key={s.id} className="bg-card rounded-xl overflow-hidden card-elevated group">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold">{s.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                <p className="text-xl font-bold text-primary mt-3">{s.priceLabel}</p>
                <Button
                  onClick={() => handleAddStrap(s)}
                  className="w-full mt-3 brand-gradient-bg text-primary-foreground rounded-full font-semibold gap-2"
                >
                  <ShoppingCart size={16} />
                  Añadir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
