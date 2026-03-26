import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import proteinaImg from "@/assets/proteina.jpg";
import creatinaImg from "@/assets/creatina.jpg";
import magnesioImg from "@/assets/magnesio.jpg";
import vitaminaCImg from "@/assets/vitamina-c.jpg";
import zmaImg from "@/assets/zma.jpg";
import cafeinaImg from "@/assets/cafeina.jpg";

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
  {
    id: "mag-01",
    name: "Magnesio Bisglicinato",
    price: 14990,
    priceLabel: "$14.990",
    img: magnesioImg,
    description: "Magnesio de alta absorción para relajación muscular y mejor sueño.",
    detailUrl: "/producto/mag-01",
  },
  {
    id: "vitc-01",
    name: "Vitamina C 1000mg",
    price: 9990,
    priceLabel: "$9.990",
    img: vitaminaCImg,
    description: "Refuerza tu sistema inmune con vitamina C de liberación prolongada.",
    detailUrl: "/producto/vitc-01",
  },
  {
    id: "zma-01",
    name: "ZMA Recovery",
    price: 16990,
    priceLabel: "$16.990",
    img: zmaImg,
    description: "Zinc, Magnesio y B6 para optimizar tu recuperación nocturna.",
    detailUrl: "/producto/zma-01",
  },
  {
    id: "caf-01",
    name: "Cafeína 200mg",
    price: 8990,
    priceLabel: "$8.990",
    img: cafeinaImg,
    description: "Energía pura y enfoque mental. Ideal como pre-entreno.",
    detailUrl: "/producto/caf-01",
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
