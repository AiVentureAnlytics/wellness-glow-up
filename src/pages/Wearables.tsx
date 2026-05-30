import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useProductsBySection } from "@/hooks/useProducts";
import { Loader2, Watch } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function Wearables() {
  const { data: products, isLoading, error } = useProductsBySection("Wearables");

  return (
    <div>
      <PageMeta
        title="Wearables de Salud en Chile — Helio Strap y Más"
        description="Tecnología wearable de última generación para seguimiento de salud, rendimiento y recuperación. Helio Strap y más. Disponible en Chile con despacho a todo el país."
        canonical="https://vitrax.cl/wearables"
      />

      {/* Category header */}
      <div className="bg-muted/30 border-b border-border/60">
        <div className="container py-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B72F0] to-cyan-400 flex items-center justify-center">
                <Watch size={18} className="text-white" />
              </div>
              <span className="section-label">Catálogo</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Wearables
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl leading-relaxed">
              Tecnología de última generación para seguimiento de salud, rendimiento y recuperación deportiva.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-10">
        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <p className="text-center text-destructive py-16">
            Error cargando productos. Recarga la página.
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
              >
                <ProductCard
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  priceLabel={p.priceLabel}
                  img={p.img}
                  description={p.description}
                  detailUrl={`/producto/${p.id}`}
                  stock={p.stock}
                  badge={p.badge}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No hay productos de wearables disponibles aún.
          </p>
        )}
      </div>
    </div>
  );
}
