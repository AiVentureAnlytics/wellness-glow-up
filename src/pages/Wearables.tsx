import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Star, Truck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useProductsBySection } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

// Imágenes adicionales para la galería del Helio Strap (en public/products/)
const galleryExtras = ["/products/helio-strap-action.webp", "/products/helio-strap-box.webp"];

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}

export default function Wearables() {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { data: products, isLoading, error } = useProductsBySection("Wearables");

  // El producto principal es el Helio (id "helio-strap"), el resto son correas
  const helio = products.find((p) => p.id === "helio-strap");
  const accesorios = products.filter((p) => p.id !== "helio-strap");

  const gallery = helio ? [helio.img, ...galleryExtras] : galleryExtras;

  const handleAddHelio = () => {
    if (!helio || helio.stock <= 0) return;
    addToCart(helio.id, helio.name, helio.price, helio.img, qty);
    toast.success(`${helio.name} (x${qty}) agregado al carrito`);
    setQty(1);
  };

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !helio) {
    return (
      <div className="container py-20 text-center">
        <p className="text-destructive">No pudimos cargar el catálogo. Intenta de nuevo.</p>
      </div>
    );
  }

  const inStock = helio.stock > 0;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-card rounded-2xl p-6 card-elevated">
            <img
              src={gallery[activeImg]}
              alt={helio.name}
              className="w-full rounded-xl aspect-square object-contain"
              width={800}
              height={800}
            />
          </div>
          <div className="flex gap-3 mt-4">
            {gallery.map((img, i) => (
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

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-wrap items-center gap-2">
            {helio.badge && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Star size={12} /> {helio.badge.toUpperCase()}
              </span>
            )}
            {!inStock && (
              <span className="text-xs font-bold uppercase tracking-wider bg-destructive text-white px-3 py-1 rounded-full">
                Agotado
              </span>
            )}
            {inStock && helio.stock <= 5 && (
              <span className="text-xs font-bold uppercase tracking-wider bg-yellow-500 text-white px-3 py-1 rounded-full">
                Últimas {helio.stock} u.
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">{helio.name}</h1>
          <p className="text-muted-foreground mt-3">{helio.description}</p>
          <p className="text-3xl font-bold text-primary mt-6">{helio.priceLabel}</p>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Truck size={16} className="text-primary shrink-0" />
            <span>Llega el <strong className="text-foreground">{getDeliveryDate()}</strong> · Despacho a todo Chile 🇨🇱</span>
          </div>

          {helio.details.length > 0 && (
            <ul className="mt-6 space-y-2">
              {helio.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5 font-bold">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          )}

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
            onClick={handleAddHelio}
            disabled={!inStock}
            className="w-full mt-6 brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2 disabled:opacity-50"
          >
            <ShoppingCart size={20} />
            {inStock ? "Agregar al carrito" : "Sin stock"}
          </Button>
        </motion.div>
      </div>

      {/* Correas / Accesorios */}
      {accesorios.length > 0 && (
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
            {accesorios.map((s) => (
              <ProductCard
                key={s.id}
                id={s.id}
                name={s.name}
                price={s.price}
                priceLabel={s.priceLabel}
                img={s.img}
                description={s.description}
                detailUrl={`/producto/${s.id}`}
                stock={s.stock}
                badge={s.badge}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
