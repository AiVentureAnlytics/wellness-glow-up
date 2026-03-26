import { Link } from "react-router-dom";
import { ArrowRight, Watch, Pill, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/helio-strap-action.webp";

const categories = [
  {
    icon: Watch,
    title: "Wearables",
    desc: "Helio Strap y tecnología de vanguardia para seguimiento de salud y rendimiento.",
    to: "/wearables",
  },
  {
    icon: Pill,
    title: "Suplementos",
    desc: "Proteínas, aminoácidos y fórmulas premium diseñadas para tus metas deportivas.",
    to: "/suplementos",
  },
  {
    icon: Heart,
    title: "Wellness",
    desc: "Soluciones de descanso, manejo del estrés y estilo de vida saludable.",
    to: "/wellness",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/20" />
        </div>
        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl md:text-6xl font-black text-primary-foreground leading-tight">
              La tienda que te quiere ver{" "}
              <span className="brand-gradient-text">triunfar</span>
            </h1>
            <p className="mt-5 text-lg text-primary-foreground/80 max-w-md">
              Vitrax combina tecnología, nutrición y bienestar para que llegues más lejos cada día.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild className="brand-gradient-bg text-primary-foreground rounded-full px-6 h-12 text-base font-semibold">
                <Link to="/suplementos">
                  Suplementos <ArrowRight size={16} className="ml-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full px-6 h-12 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/wearables">Wearables</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="container py-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Todo sobre <span className="brand-gradient-text">nosotros</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            En Vitrax creemos en el potencial humano. Somos un equipo apasionado por la ciencia,
            la innovación y la nutrición inteligente. Nuestra misión es apoyarte con productos de
            alta calidad y experiencias que te permitan rendir mejor en el día a día.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container pb-20">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          Explora tu <span className="brand-gradient-text">categoría</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <Link
                to={cat.to}
                className="block bg-card rounded-xl p-8 card-elevated group text-center"
              >
                <div className="w-16 h-16 rounded-2xl brand-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <cat.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{cat.title}</h3>
                <p className="text-muted-foreground text-sm">{cat.desc}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4">
                  Ver productos <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="brand-gradient-bg py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Listos para tu mejor versión
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Compra ahora y recibe despacho rápido en Chile. Vive la experiencia Vitrax.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild className="bg-card text-foreground rounded-full px-8 h-12 text-base font-semibold hover:bg-card/90">
              <Link to="/suplementos">Ver Suplementos</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/wearables">Ver Wearables</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
