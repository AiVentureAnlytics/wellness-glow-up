import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useProductsBySection } from "@/hooks/useProducts";
import type { Category } from "@/lib/products";
import PageMeta from "@/components/PageMeta";
import { Loader2, Pill } from "lucide-react";

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

  const base = filter === "todos" ? products : products.filter((p) => p.category === filter);
  const filtered = [...base].sort((a, b) => {
    if (a.stock > 0 && b.stock === 0) return -1;
    if (a.stock === 0 && b.stock > 0) return 1;
    return 0;
  });

  return (
    <div>
      <PageMeta
        title="Suplementos Premium en Chile — Proteínas, Creatinas y Vitaminas"
        description="Proteínas, creatinas, vitaminas y energéticos de importación directa. Dymatize, OstroVit, MuscleTech, Finaflex y más. Stock en Chile, despacho a todo el país."
        canonical="https://vitrax.cl/suplementos"
      />

      {/* Category header */}
      <div className="bg-muted/30 border-b border-border/60">
        <div className="container py-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                <Pill size={18} className="text-white" />
              </div>
              <span className="section-label">Catálogo</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Suplementos premium
            </h1>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl leading-relaxed">
              Importación directa de Dymatize, OstroVit y MuscleTech. Stock permanente en Chile.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === c.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card border border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

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
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
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
                  original_price={p.original_price}
                />
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No hay productos en esta categoría aún.
          </p>
        )}
      </div>
    </div>
  );
}
