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
}

export default function ProductCard({ id, name, price, priceLabel, img, description, detailUrl }: Props) {
  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, name, price, img);
    toast.success(`${name} agregado al carrito`);
  };

  const card = (
    <div className="bg-card rounded-lg overflow-hidden card-elevated group">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={img}
          alt={name}
          loading="lazy"
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
            className="flex-1 brand-gradient-bg text-primary-foreground rounded-full font-semibold gap-2"
          >
            <ShoppingCart size={16} />
            Añadir
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
