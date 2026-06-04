import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { formatCLP } from "@/lib/products";
import { useProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart, Minus, Plus, ArrowLeft, Truck,
  PackageX, Loader2, Shield, CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";

const BASE_URL = "https://vitrax.cl";

function getDeliveryDate() {
  const d = new Date();
  let businessDays = 0;
  while (businessDays < 3) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) businessDays++;
  }
  const weekday = d.toLocaleDateString("es-CL", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("es-CL", { month: "long" });
  return `${weekday}, ${day} de ${month}`;
}

export default function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useProduct(productId);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="container py-24 flex justify-center">
        <Loader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-24 max-w-md text-center">
        <PackageX size={56} className="mx-auto text-muted-foreground/30 mb-5" />
        <h1 className="font-display text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground mt-2">
          El producto que buscas ya no está disponible o el link es inválido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
          <Link to="/suplementos" className="btn-primary h-11 px-7 text-sm">
            Ver suplementos
          </Link>
          <Link
            to="/"
            className="btn-ghost h-11 px-7 text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product.id, product.name, product.price, product.img, qty);
    toast.success(`${product.name} (×${qty}) agregado al carrito`);
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
    <div className="container py-10 pb-20">
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

      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a {product.section}
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* ── Image column ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="md:sticky md:top-24"
        >
          <div className="bg-muted/20 rounded-2xl border border-border/60 p-6 aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-xl"
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
          </div>
        </motion.div>

        {/* ── Info column ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex flex-col"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="section-label">{product.section}</span>
            {product.badge && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-foreground text-card px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            {!inStock && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-destructive text-white px-3 py-1 rounded-full">
                Agotado
              </span>
            )}
            {inStock && lowStock && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white px-3 py-1 rounded-full">
                Últimas {product.stock} u.
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="mt-6 flex flex-col gap-1">
            {product.original_price && product.original_price > product.price ? (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-display text-4xl font-bold tracking-tight text-blue-600">
                    {formatCLP(product.price)}
                  </p>
                  <span className="text-sm font-bold uppercase tracking-wider bg-red-500 text-white px-3 py-1 rounded-full">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                </div>
                <p className="text-muted-foreground text-lg line-through">
                  {formatCLP(product.original_price)}
                </p>
              </>
            ) : (
              <p className="font-display text-4xl font-bold tracking-tight">
                {formatCLP(product.price)}
              </p>
            )}
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-2.5 mt-4 text-sm bg-muted/40 border border-border/50 rounded-xl px-4 py-3">
            <Truck size={16} className="text-primary shrink-0" />
            <span className="text-muted-foreground">
              Llega el{" "}
              <strong className="text-foreground font-semibold">{getDeliveryDate()}</strong>
              {" "}· Despacho a todo Chile
            </span>
          </div>

          {/* Details */}
          {product.details.length > 0 && (
            <div className="mt-7 border-t border-border/60 pt-6">
              <h3 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Características
              </h3>
              <ul className="space-y-2.5">
                {product.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 size={15} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qty + Add to cart */}
          {inStock ? (
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Cantidad</span>
                <div className="flex items-center gap-2 bg-muted/40 rounded-full px-1 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 hover:bg-background"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="text-sm font-bold w-6 text-center tabular-nums">{qty}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 hover:bg-background"
                    onClick={() => setQty(Math.min(qty + 1, product.stock))}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="btn-primary w-full h-14 text-base justify-center rounded-xl"
              >
                <ShoppingCart size={19} />
                Agregar al carrito · {formatCLP(product.price * qty)}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="mt-8 w-full h-14 text-base rounded-xl bg-muted text-muted-foreground cursor-not-allowed font-semibold"
            >
              Sin stock
            </button>
          )}

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-primary" />
              Pago 100% seguro
            </span>
            <span className="flex items-center gap-1.5">
              <Truck size={13} className="text-primary" />
              Envío a todo Chile
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
