import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useProductsBySection } from "@/hooks/useProducts";
import type { Category } from "@/lib/products";
import PageMeta from "@/components/PageMeta";
import { Loader2 } from "lucide-react";

type Filter = "todos" | Category;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "proteinas", label: "Proteínas" },
  { id: "creatinas", label: "Creatinas" },
  { id: "vitaminas", label: "Vitaminas & Minerales" },
  { id: "energia", label: "Energía" },
];

export default function Suplementos() {
  const [filter, setFilter] = useState<Filter>("todos");
  const { data: products, isLoading, error } = useProductsBySection("Suplementos");

  const filtered = filter === "todos" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="container py-12">
      <PageMeta
        title="Suplementos Premium en Chile — Proteínas, Creatinas y Vitaminas"
        description="Proteínas, creatinas, vitaminas y energéticos de importación directa. Dymatize, OstroVit y más. Stock en Chile, despacho 24-72h a todo el país."
        canonical="https://vitrax.cl/suplementos"
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
          Catálogo
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold mt-3">
          Suplementos premium
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Importación directa de Dymatize y OstroVit. Stock en Chile, despacho 24-72h.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mt-6 mb-8">
        {FILTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === c.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
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

      {!isLoading && !error && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No hay productos en esta categoría aún.
        </p>
      )}
    </div>
  );
}
