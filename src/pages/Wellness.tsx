import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import nightGlassesImg from "@/assets/night-glasses.jpg";

const products = [
  {
    id: "well-01",
    name: "Lentes de Bloqueo Azul (Nightime)",
    price: 25000,
    priceLabel: "$25.000",
    img: nightGlassesImg,
    description: "Mejora tu melatonina y duerme profundamente.",
    detailUrl: "/producto/well-01",
  },
];

export default function Wellness() {
  return (
    <div className="container py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-bold mb-8"
      >
        Wellness
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
