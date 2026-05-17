import { Link } from "react-router-dom";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="bg-card rounded-lg overflow-hidden card-elevated group relative">
      {/* Badges flotantes */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-white px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
        {!inStock && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-destructive text-white px-2 py-1 rounded-full">
            Agotado
          </span>
        )}
        {inStock && lowStock && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500 text-white px-2 py-1 rounded-full">
            Últimas {stock} u.
          </span>
        )}
      </div>

      <div className={`aspect-square overflow-hidden bg-white ${!inStock ? "opacity-60" : ""}`}>
        <img
          src={img}
          alt={name}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.fallback) {
              target.dataset.fallback = "1";
              target.src = "/placeholder.svg";
            }
          }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-display font-bold text-lg">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        <p className="text-xl font-bold text-primary mt-3">{priceLabel}</p>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleAdd}
            disabled={!inStock}
            className="flex-1 brand-gradient-bg text-primary-foreground rounded-full font-semibold gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {inStock ? "Añadir" : "Agotado"}
          </Button>
          {detailUrl && (
            <Button asChild variant="outline" className="rounded-full px-4">
              <Link to={detailUrl} onClick={(e) => e.stopPropagation()}>
                <Eye size={16} />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (detailUrl) {
    return <Link to={detailUrl} className="block">{card}</Link>;
  }

  return card;
}
