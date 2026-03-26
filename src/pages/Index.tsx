import { Link } from "react-router-dom";
import { ArrowRight, Watch, Pill, Heart, Zap, Shield, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/helio-strap-action.webp";

const categories = [
  {
    icon: Watch,
    title: "Wearables",
    desc: "Helio Strap y tecnología de vanguardia para seguimiento de salud y rendimiento.",
    to: "/wearables",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Pill,
    title: "Suplementos",
    desc: "Proteínas, aminoácidos y fórmulas premium diseñadas para tus metas deportivas.",
    to: "/suplementos",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Heart,
    title: "Wellness",
    desc: "Soluciones de descanso, manejo del estrés y estilo de vida saludable.",
    to: "/wellness",
    color: "from-violet-500 to-purple-400",
  },
];

const stats = [
  { value: "10K+", label: "Clientes felices" },
  { value: "99%", label: "Satisfacción" },
  { value: "100%", label: "Premium" },
];

const values = [
  { icon: Zap, title: "Rendimiento", desc: "Productos respaldados por ciencia para maximizar tus resultados." },
  { icon: Shield, title: "Calidad Premium", desc: "Ingredientes de grado farmacéutico, sin rellenos ni aditivos." },
  { icon: Truck, title: "Despacho Rápido", desc: "Envío rápido con seguimiento en tiempo real." },
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

      {/* Stats */}
      <section className="border-b border-border/50">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-black brand-gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About — redesigned */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Quiénes somos
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              Creemos en tu <span className="brand-gradient-text">potencial</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              En Vitrax somos un equipo apasionado por la ciencia, la innovación y la nutrición inteligente.
              Seleccionamos cada producto con un solo criterio: que realmente funcione.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Desde suplementos de grado farmacéutico hasta wearables de última generación,
              nuestra misión es darte las herramientas para rendir al máximo cada día.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="flex gap-4 bg-card rounded-xl p-5 card-elevated"
              >
                <div className="w-12 h-12 rounded-xl brand-gradient-bg flex items-center justify-center shrink-0">
                  <v.icon size={22} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — redesigned */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Catálogo
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
              Explora nuestras <span className="brand-gradient-text">categorías</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Tres pilares para tu mejor versión: tecnología, nutrición y bienestar.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <Link
                  to={cat.to}
                  className="block bg-card rounded-2xl p-8 card-elevated group text-center hover:scale-[1.02] transition-transform"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <cat.icon size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
                  <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                    Ver productos <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — simplified */}
      <section className="brand-gradient-bg py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            🇨🇱 Despacho a todo Chile
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Compra ahora y recibe tu pedido en 24 a 72 horas. Seguimiento en tiempo real.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild className="bg-card text-foreground rounded-full px-8 h-12 text-base font-semibold hover:bg-card/90">
              <Link to="/suplementos">Ver Suplementos</Link>
            </Button>
            <Button asChild className="bg-foreground/20 text-primary-foreground border border-primary-foreground/30 rounded-full px-8 h-12 text-base font-semibold hover:bg-foreground/30">
              <Link to="/wearables">Ver Wearables</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
