import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatCLP } from "@/lib/products";
import { useProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck, PackageX, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";

const BASE_URL = "https://vitrax.cl";

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}

export default function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useProduct(productId);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 max-w-md text-center">
        <PackageX size={64} className="mx-auto text-muted-foreground/40 mb-4" />
        <h1 className="font-display text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground mt-2">
          El producto que buscas ya no está disponible o el link es inválido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button asChild className="brand-gradient-bg text-primary-foreground rounded-full px-8">
            <Link to="/suplementos">Ver suplementos</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product.id, product.name, product.price, product.img, qty);
    toast.success(`${product.name} (x${qty}) agregado al carrito`);
    setQty(1);
  };

  const backTo =
    product.section === "Wellness" ? "/wellness" :
    product.section === "Wearables" ? "/wearables" : "/suplementos";

  const metaDescription = product.description
    ? product.description.slice(0, 155)
    : `${product.name} — ${product.section} premium en Chile. Despacho a todo el país.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? metaDescription,
    image: product.img,
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Level Up" },
    },
  };

  return (
    <div className="container py-12">
      <PageMeta
        title={product.name}
        description={metaDescription}
        canonical={`${BASE_URL}/producto/${product.id}`}
        ogImage={product.img}
        ogType="product"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Volver a {product.section}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl p-6 card-elevated"
        >
          <img
            src={product.img}
            alt={product.name}
            className="w-full rounded-xl aspect-square object-contain bg-white"
            width={800}
            height={800}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = "1";
                target.src = "/placeholder.svg";
              }
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {product.section}
            </span>
            {product.badge && (
              <span className="text-xs font-bold text-white bg-foreground px-3 py-1 rounded-full uppercase tracking-wider">
                {product.badge}
              </span>
            )}
            {!inStock && (
              <span className="text-xs font-bold uppercase tracking-wider bg-destructive text-white px-3 py-1 rounded-full">
                Agotado
              </span>
            )}
            {inStock && lowStock && (
              <span className="text-xs font-bold uppercase tracking-wider bg-yellow-500 text-white px-3 py-1 rounded-full">
                Últimas {product.stock} u.
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">{product.name}</h1>
          <p className="text-muted-foreground mt-3 text-lg">{product.description}</p>
          <p className="text-3xl font-bold text-primary mt-6">{formatCLP(product.price)}</p>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Truck size={16} className="text-primary shrink-0" />
            <span>Llega el <strong className="text-foreground">{getDeliveryDate()}</strong> · Despacho a todo Chile 🇨🇱</span>
          </div>

          {product.details.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-display font-semibold">Características:</h3>
              <ul className="space-y-2">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {inStock && (
            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus size={16} />
              </Button>
              <span className="text-lg font-bold w-8 text-center">{qty}</span>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(Math.min(qty + 1, product.stock))}>
                <Plus size={16} />
              </Button>
            </div>
          )}

          <Button
            onClick={handleAdd}
            disabled={!inStock}
            className="w-full mt-6 brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2 disabled:opacity-50"
          >
            <ShoppingCart size={20} />
            {inStock ? `Agregar al carrito · ${formatCLP(product.price * qty)}` : "Sin stock"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
