import { Link } from "react-router-dom";
import { ArrowRight, Watch, Pill, Heart, Zap, Shield, Truck, CheckCircle2, Star, Package } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/helio-strap-action.webp";
import PageMeta from "@/components/PageMeta";

const categories = [
  {
    icon: Watch,
    title: "Wearables",
    desc: "Tecnología de vanguardia para tracking de salud y rendimiento deportivo.",
    to: "/wearables",
    gradient: "from-[#1e3a8a] via-[#1d4ed8] to-[#3B72F0]",
    tag: "Smart Fitness",
  },
  {
    icon: Pill,
    title: "Suplementos",
    desc: "Proteínas, creatinas y fórmulas premium de importación directa.",
    to: "/suplementos",
    gradient: "from-[#065f46] via-[#047857] to-[#10b981]",
    tag: "Más vendido",
  },
  {
    icon: Heart,
    title: "Wellness",
    desc: "Descanso, manejo del estrés y bienestar para tu mejor versión.",
    to: "/wellness",
    gradient: "from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6]",
    tag: "Bienestar integral",
  },
];

const trustItems = [
  {
    icon: Zap,
    title: "Importadores Directos",
    desc: "Sin intermediarios en Chile",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: Truck,
    title: "Despacho a domicilio",
    desc: "A todo Chile con seguimiento",
    color: "text-primary",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Pago 100% Seguro",
    desc: "MercadoPago",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: CheckCircle2,
    title: "Productos Originales",
    desc: "Certificados de autenticidad",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

const values = [
  {
    icon: Zap,
    title: "Respaldado por ciencia",
    desc: "Cada producto pasa por evaluación de ingredientes activos y dosificación efectiva.",
  },
  {
    icon: Shield,
    title: "Calidad certificada",
    desc: "Grado farmacéutico, sin rellenos. Importación directa con trazabilidad completa.",
  },
  {
    icon: Truck,
    title: "Despacho a todo Chile",
    desc: "Stock en Chile. Seguimiento en tiempo real a todo el país.",
  },
];

const brands = [
  { name: "Dymatize", origin: "USA" },
  { name: "OstroVit", origin: "Europa" },
  { name: "MuscleTech", origin: "USA" },
  { name: "Helio Strap", origin: "Tech" },
];

const floatingStats = [
  { icon: Package, label: "Catálogo seleccionado", sub: "Productos premium" },
  { icon: Truck, label: "Despacho", sub: "Despacho garantizado" },
  { icon: Shield, label: "100% originales", sub: "Certificados" },
];

const aboutStats = [
  { value: "Catálogo", label: "Seleccionado" },
  { value: "Marcas", label: "Internacionales" },
  { value: "Máx. 2 semanas", label: "Despacho" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: "easeOut" },
  }),
};

export default function Index() {
  return (
    <div>
      <PageMeta
        title="Suplementos, Wearables y Wellness en Chile"
        description="Level Up — Importadores directos de Dymatize, OstroVit y tecnología wearable en Chile. Proteínas, creatinas, vitaminas y wellness. Despacho a todo Chile."
        canonical="https://vitrax.cl/"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
          />
          {/* Cinematic directional overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(6,13,30,0.93) 0%, rgba(6,13,30,0.72) 45%, rgba(6,13,30,0.18) 100%)" }} />
          {/* Bottom fade to background */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-[0.07]" style={{ background: "radial-gradient(circle, hsl(217 84% 57%) 0%, transparent 68%)" }} />

        <div className="container relative z-10 py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
                Importadores directos · Santiago, Chile
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-[4.5rem] font-bold text-white leading-[1.03] tracking-tight">
              Suplementos premium.<br />
              <span className="brand-gradient-text">Sin intermediarios.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/65 max-w-md leading-relaxed">
              Dymatize, OstroVit y wearables de última generación.
              Stock en Chile — despacho a todo el país.
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link to="/suplementos" className="btn-primary h-12 px-8 text-base">
                Ver suplementos
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/wearables"
                className="inline-flex items-center gap-2 rounded-full px-8 h-12 text-base font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              >
                Ver wearables
              </Link>
            </div>

            {/* Trust micro-row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                ))}
                <span className="text-white/50 text-xs ml-1.5">Despacho garantizado</span>
              </div>
              <span className="text-white/20 hidden md:block">·</span>
              <div className="flex items-center gap-1.5 text-white/50 text-xs">
                <CheckCircle2 size={12} className="text-emerald-400" />
                Productos 100% originales
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating stats card — large screens only */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" }}
          className="absolute right-[7%] top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 space-y-4 min-w-[210px]">
            {floatingStats.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl brand-gradient-bg flex items-center justify-center shrink-0">
                  <item.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">{item.label}</p>
                  <p className="text-white/50 text-xs">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Trust / Benefits strip ── */}
      <section className="border-y border-border/60 bg-card">
        <div className="container py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="py-6 px-5 flex items-center gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon size={20} className={item.color} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mb-14"
          >
            <span className="section-label">Catálogo</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight">
              Todo lo que necesitas<br className="hidden md:block" />{" "}
              para <span className="brand-gradient-text">rendir al máximo</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg text-lg leading-relaxed">
              Tres pilares seleccionados por expertos. Cada producto tiene un propósito.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
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
                  className="group block rounded-2xl overflow-hidden border border-transparent hover:shadow-xl transition-all duration-300 card-elevated"
                >
                  {/* Full-gradient header */}
                  <div className={`bg-gradient-to-br ${cat.gradient} px-8 pt-10 pb-8 relative overflow-hidden`}>
                    {/* Subtle dot texture */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                      }}
                    />
                    {/* Tag */}
                    <span className="relative inline-block text-[10px] font-bold tracking-widest uppercase bg-white/20 text-white/90 px-2.5 py-1 rounded-full mb-5">
                      {cat.tag}
                    </span>
                    <div className="relative">
                      <cat.icon
                        size={42}
                        className="text-white/85 mb-4 group-hover:scale-110 transition-transform duration-300"
                      />
                      <h3 className="font-display text-2xl font-bold text-white">{cat.title}</h3>
                      <p className="text-sm text-white/65 mt-2 leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                  {/* Footer row */}
                  <div className="px-8 py-4 bg-card border-t border-border/40 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Ver productos</span>
                    <ArrowRight
                      size={16}
                      className="text-primary group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brands strip ── */}
      <section className="border-y border-border/40 bg-muted/20 py-9">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground shrink-0">
              Marcas que importamos
            </p>
            <div className="hidden md:block w-px h-7 bg-border/60" />
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-10 gap-y-3">
              {brands.map((b) => (
                <div key={b.name} className="flex items-center gap-2">
                  <span className="font-display font-bold text-xl tracking-tight text-foreground/75 hover:text-foreground transition-colors duration-200">
                    {b.name}
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {b.origin}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── About / Values ── */}
      <section className="bg-muted/30 border-y border-border/40 py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <span className="section-label">Quiénes somos</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                Somos los{" "}
                <span className="brand-gradient-text">importadores</span>{" "}
                que querías
              </h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Seleccionamos cada producto con un solo criterio:{" "}
                <strong className="text-foreground">que realmente funcione.</strong>
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Importación directa de Dymatize, OstroVit y más marcas top de EE.UU. y Europa.
                Productos de grado farmacéutico con trazabilidad completa, disponibles en Chile.
              </p>

              {/* Credibility mini-stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-border/50 pt-8">
                {aboutStats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-2xl font-bold brand-gradient-text">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/suplementos"
                className="btn-primary mt-8 inline-flex h-11 px-6 text-sm"
              >
                Ver catálogo completo
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            <div className="flex flex-col gap-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i + 1}
                  className="flex gap-4 bg-card rounded-xl p-5 border border-border/60 hover:border-primary/20 transition-colors duration-200"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="w-11 h-11 rounded-xl brand-gradient-bg flex items-center justify-center shrink-0">
                    <v.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-[15px]">{v.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden brand-gradient-bg py-28">
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        {/* Ambient blobs */}
        <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-white/55 text-[11px] font-semibold uppercase tracking-[0.2em] mb-4">
              Listo para empezar
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
              Tu próximo nivel<br className="hidden md:block" /> empieza hoy
            </h2>
            <p className="mt-5 text-white/65 max-w-lg mx-auto text-lg leading-relaxed">
              Explora nuestro catálogo completo de suplementos, wearables y wellness.
              Despacho a todo Chile.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              <Link
                to="/suplementos"
                className="inline-flex items-center gap-2 rounded-full px-8 h-12 text-sm font-semibold bg-white text-[hsl(217,84%,57%)] hover:bg-white/95 transition-all duration-200 shadow-lg"
              >
                Ver Suplementos
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/wearables"
                className="inline-flex items-center gap-2 rounded-full px-8 h-12 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                Ver Wearables
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
