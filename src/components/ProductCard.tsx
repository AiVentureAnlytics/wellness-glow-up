import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  img: string;
  description?: string;
}

export default function ProductCard({ id, name, price, priceLabel, img, description }: Props) {
  const handleAdd = () => {
    addToCart(id, name, price, img);
    toast.success(`${name} agregado al carrito`);
  };

  return (
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
        <Button
          onClick={handleAdd}
          className="w-full mt-4 brand-gradient-bg text-primary-foreground rounded-full font-semibold gap-2"
        >
          <ShoppingCart size={16} />
          Añadir al Carrito
        </Button>
      </div>
    </div>
  );
}
