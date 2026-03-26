import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import proteinaImg from "@/assets/proteina.jpg";
import creatinaImg from "@/assets/creatina.jpg";

const products = [
  {
    id: "prot-01",
    name: "Proteína Whey Isolada",
    price: 34990,
    priceLabel: "$34.990",
    img: proteinaImg,
    description: "30g de proteína por porción. Fórmula premium de rápida absorción.",
    detailUrl: "/producto/prot-01",
  },
  {
    id: "crea-01",
    name: "Creatina Micronizada",
    price: 19990,
    priceLabel: "$19.990",
    img: creatinaImg,
    description: "5g de creatina monohidratada. Potencia tu fuerza y recuperación.",
    detailUrl: "/producto/crea-01",
  },
];

export default function Suplementos() {
  return (
    <div className="container py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold mb-8"
      >
        Suplementos
      </motion.h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard {...p} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
