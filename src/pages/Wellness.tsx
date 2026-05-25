import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useProductsBySection } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function Wellness() {
  const { data: products, isLoading, error } = useProductsBySection("Wellness");

  return (
    <div className="container py-12">
      <PageMeta
        title="Productos Wellness en Chile — Descanso y Recuperación"
        description="Suplementos para mejorar tu descanso, recuperación y bienestar diario. Productos de calidad premium con despacho a todo Chile en 24-72h."
        canonical="https://vitrax.cl/wellness"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
          Catálogo
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-3">
          Wellness
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Productos para mejorar tu descanso, recuperación y bienestar diario.
        </p>
      </motion.div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <p className="text-center text-destructive py-12">
          Error cargando productos. Recarga la página.
        </p>
      )}

      {!isLoading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
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
        <p className="text-center text-muted-foreground py-12">
          Pronto agregaremos productos de wellness.
        </p>
      )}
    </div>
  );
}
