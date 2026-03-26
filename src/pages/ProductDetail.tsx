import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, ArrowLeft, Truck } from "lucide-react";
import { motion } from "framer-motion";
import proteinaImg from "@/assets/proteina.jpg";
import creatinaImg from "@/assets/creatina.jpg";
import nightGlassesImg from "@/assets/night-glasses.jpg";
import magnesioImg from "@/assets/magnesio.jpg";
import vitaminaCImg from "@/assets/vitamina-c.jpg";
import zmaImg from "@/assets/zma.jpg";
import cafeinaImg from "@/assets/cafeina.jpg";
import desodoranteImg from "@/assets/desodorante.jpg";
import pastaDientesImg from "@/assets/pasta-dientes.jpg";
import antifazImg from "@/assets/antifaz.jpg";

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });
}

const allProducts: Record<string, {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  img: string;
  description: string;
  details: string[];
  category: string;
}> = {
  "prot-01": {
    id: "prot-01",
    name: "Proteína Whey Isolada",
    price: 34990,
    priceLabel: "$34.990",
    img: proteinaImg,
    description: "30g de proteína por porción. Fórmula premium de rápida absorción.",
    details: [
      "30g de proteína de suero aislada por porción",
      "Baja en grasas y carbohidratos",
      "Absorción rápida post-entrenamiento",
      "Sabores naturales sin azúcar añadida",
      "900g por envase (~30 porciones)",
    ],
    category: "Suplementos",
  },
  "crea-01": {
    id: "crea-01",
    name: "Creatina Micronizada",
    price: 19990,
    priceLabel: "$19.990",
    img: creatinaImg,
    description: "5g de creatina monohidratada. Potencia tu fuerza y recuperación.",
    details: [
      "5g de creatina monohidratada por porción",
      "Micronizada para mejor absorción",
      "Aumenta fuerza y potencia muscular",
      "Sin sabor, fácil de mezclar",
      "300g por envase (~60 porciones)",
    ],
    category: "Suplementos",
  },
  "mag-01": {
    id: "mag-01",
    name: "Magnesio Bisglicinato",
    price: 14990,
    priceLabel: "$14.990",
    img: magnesioImg,
    description: "Magnesio de alta absorción para relajación muscular y mejor sueño.",
    details: [
      "200mg de magnesio elemental por cápsula",
      "Forma bisglicinato para máxima absorción",
      "Reduce calambres y tensión muscular",
      "Mejora la calidad del sueño",
      "90 cápsulas por envase",
    ],
    category: "Suplementos",
  },
  "vitc-01": {
    id: "vitc-01",
    name: "Vitamina C 1000mg",
    price: 9990,
    priceLabel: "$9.990",
    img: vitaminaCImg,
    description: "Refuerza tu sistema inmune con vitamina C de liberación prolongada.",
    details: [
      "1000mg de ácido ascórbico por tableta",
      "Liberación prolongada de 8 horas",
      "Antioxidante potente",
      "Refuerza el sistema inmunológico",
      "60 tabletas por envase",
    ],
    category: "Suplementos",
  },
  "zma-01": {
    id: "zma-01",
    name: "ZMA Recovery",
    price: 16990,
    priceLabel: "$16.990",
    img: zmaImg,
    description: "Zinc, Magnesio y B6 para optimizar tu recuperación nocturna.",
    details: [
      "Zinc 30mg + Magnesio 450mg + Vitamina B6 10mg",
      "Optimiza la recuperación muscular nocturna",
      "Mejora calidad del sueño profundo",
      "Apoya la producción natural de testosterona",
      "90 cápsulas por envase",
    ],
    category: "Suplementos",
  },
  "caf-01": {
    id: "caf-01",
    name: "Cafeína 200mg",
    price: 8990,
    priceLabel: "$8.990",
    img: cafeinaImg,
    description: "Energía pura y enfoque mental. Ideal como pre-entreno.",
    details: [
      "200mg de cafeína anhidra por cápsula",
      "Energía sostenida sin crash",
      "Mejora concentración y rendimiento",
      "Ideal como pre-entrenamiento",
      "100 cápsulas por envase",
    ],
    category: "Suplementos",
  },
  "well-01": {
    id: "well-01",
    name: "Lentes de Bloqueo Azul (Nightime)",
    price: 25000,
    priceLabel: "$25.000",
    img: nightGlassesImg,
    description: "Mejora tu melatonina y duerme profundamente.",
    details: [
      "Bloquea el 99% de la luz azul nociva",
      "Mejora la producción natural de melatonina",
      "Diseño liviano y cómodo para uso prolongado",
      "Ideal para uso nocturno frente a pantallas",
      "Incluye estuche protector",
    ],
    category: "Wellness",
  },
  "well-02": {
    id: "well-02",
    name: "Desodorante Natural",
    price: 7990,
    priceLabel: "$7.990",
    img: desodoranteImg,
    description: "Sin aluminio ni químicos. Protección natural todo el día.",
    details: [
      "Libre de aluminio, parabenos y alcohol",
      "Ingredientes 100% naturales",
      "Protección efectiva 24 horas",
      "Apto para pieles sensibles",
      "Envase eco-friendly biodegradable",
    ],
    category: "Wellness",
  },
  "well-03": {
    id: "well-03",
    name: "Pasta de Dientes Natural",
    price: 5990,
    priceLabel: "$5.990",
    img: pastaDientesImg,
    description: "Ingredientes orgánicos, sin flúor. Cuidado bucal consciente.",
    details: [
      "Sin flúor, SLS ni parabenos",
      "Ingredientes orgánicos certificados",
      "Blanqueamiento natural con carbón activado",
      "Sabor menta fresca natural",
      "Tubo reciclable de 100ml",
    ],
    category: "Wellness",
  },
  "well-04": {
    id: "well-04",
    name: "Antifaz para Dormir",
    price: 12990,
    priceLabel: "$12.990",
    img: antifazImg,
    description: "Seda premium con bloqueo total de luz. Sueño reparador.",
    details: [
      "100% seda de morera natural",
      "Bloqueo total de luz",
      "Correa ajustable ultra-suave",
      "No deja marcas en la piel",
      "Incluye bolsa de viaje",
    ],
    category: "Wellness",
  },
};

export default function ProductDetail() {
  const { productId } = useParams();
  const product = productId ? allProducts[productId] : null;
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Producto no encontrado</h1>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product.id, product.name, product.price, product.img, qty);
    toast.success(`${product.name} (x${qty}) agregado al carrito`);
    setQty(1);
  };

  const backTo = product.category === "Wellness" ? "/wellness" : "/suplementos";

  return (
    <div className="container py-12">
      <Link to={backTo} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Volver a {product.category}
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-2xl p-6 card-elevated"
        >
          <img src={product.img} alt={product.name} className="w-full rounded-xl aspect-square object-cover" width={800} height={800} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {product.category.toUpperCase()}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4">{product.name}</h1>
          <p className="text-muted-foreground mt-3 text-lg">{product.description}</p>
          <p className="text-3xl font-bold text-primary mt-6">{product.priceLabel}</p>

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
            <Truck size={16} className="text-primary shrink-0" />
            <span>Llega el <strong className="text-foreground">{getDeliveryDate()}</strong> · Despacho a todo Chile 🇨🇱</span>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-display font-semibold">Características:</h3>
            <ul className="space-y-2">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(Math.max(1, qty - 1))}>
              <Minus size={16} />
            </Button>
            <span className="text-lg font-bold w-8 text-center">{qty}</span>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setQty(qty + 1)}>
              <Plus size={16} />
            </Button>
          </div>

          <Button
            onClick={handleAdd}
            className="w-full mt-6 brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2"
          >
            <ShoppingCart size={20} />
            Agregar al carrito
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
