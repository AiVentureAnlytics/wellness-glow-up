import { Link } from "react-router-dom";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  img: string;
  description?: string;
  detailUrl?: string;
  stock?: number;
  badge?: string;
}

export default function ProductCard({
  id, name, price, priceLabel, img, description, detailUrl, stock, badge,
}: Props) {
  const inStock = (stock ?? 999) > 0;
  const lowStock = inStock && (stock ?? 999) <= 5;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addToCart(id, name, price, img);
    toast.success(`${name} agregado al carrito`);
  };

  const card = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="bg-card rounded-xl overflow-hidden border border-border/60 group relative flex flex-col"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-card px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}
        {!inStock && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive text-white px-2.5 py-1 rounded-full">
            Agotado
          </span>
        )}
        {inStock && lowStock && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-1 rounded-full">
            Últimas {stock} u.
          </span>
        )}
      </div>

      {/* Quick-view button */}
      {detailUrl && (
        <Link
          to={detailUrl}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border/60 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-primary hover:border-primary/30"
        >
          <Eye size={14} />
        </Link>
      )}

      {/* Image */}
      <div className={`relative aspect-square overflow-hidden bg-muted/30 ${!inStock ? "opacity-60" : ""}`}>
        <img
          src={img}
          alt={name}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              target.src = "/placeholder.svg";
            }
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 pt-3.5">
        <h3 className="font-display font-semibold text-[15px] leading-snug line-clamp-2">{name}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{description}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <p className="font-display text-xl font-bold text-foreground tracking-tight">{priceLabel}</p>

          <button
            onClick={handleAdd}
            disabled={!inStock}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 shrink-0 ${
              inStock
                ? "btn-primary text-white h-9 text-xs"
                : "bg-muted text-muted-foreground cursor-not-allowed h-9"
            }`}
          >
            {inStock ? (
              <>
                <ShoppingCart size={13} />
                Añadir
              </>
            ) : (
              "Sin stock"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (detailUrl) {
    return <Link to={detailUrl} className="block">{card}</Link>;
  }

  return card;
}
