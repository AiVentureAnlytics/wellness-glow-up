import { Link } from "react-router-dom";
import { ArrowRight, Watch, Pill, Heart, Zap, Shield, Truck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/helio-strap-action.webp";
import PageMeta from "@/components/PageMeta";

const categories = [
  {
    icon: Watch,
    title: "Wearables",
    desc: "Tecnología de vanguardia para tracking de salud y rendimiento deportivo.",
    to: "/wearables",
    gradient: "from-[#3B72F0] to-[#06b6d4]",
    bg: "bg-blue-50",
  },
  {
    icon: Pill,
    title: "Suplementos",
    desc: "Proteínas, aminoácidos y fórmulas premium de importación directa.",
    to: "/suplementos",
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Wellness",
    desc: "Descanso, manejo del estrés y bienestar para tu mejor versión.",
    to: "/wellness",
    gradient: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
  },
];

const stats = [
  { value: "10K+", label: "Clientes" },
  { value: "99%", label: "Satisfacción" },
  { value: "24h", label: "Despacho" },
  { value: "100%", label: "Original" },
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
    title: "Despacho 24–72 h",
    desc: "Stock en Chile. Seguimiento en tiempo real a todo el país.",
  },
];

const brandsBullets = [
  "Dymatize — USA",
  "OstroVit — Europa",
  "Helio Strap — Tech",
  "Importación directa",
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
        description="Level Up — Importadores directos de Dymatize, OstroVit y tecnología wearable en Chile. Proteínas, creatinas, vitaminas y wellness. Despacho a todo Chile en 24-72h."
        canonical="https://vitrax.cl/"
      />

      {/* ── Hero ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover object-center"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,25%,6%)/0.88] via-[hsl(222,25%,6%)/0.65] to-[hsl(222,25%,6%)/0.15]" />
        </div>

        <div className="container relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-5">
              Importadores directos · Santiago, Chile
            </span>
            <h1 className="font-display text-5xl md:text-[4.25rem] font-bold text-white leading-[1.05] tracking-tight">
              Tu mejor versión<br />
              empieza{" "}
              <span className="brand-gradient-text">aquí</span>
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-md leading-relaxed">
              Suplementos premium, wearables de última generación y wellness — todo en un lugar, con despacho a todo Chile.
            </p>

            {/* Brand bullets */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-7">
              {brandsBullets.map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-sm text-white/60">
                  <CheckCircle2 size={13} className="text-primary shrink-0" />
                  {b}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-9">
              <Link to="/suplementos" className="btn-primary h-12 px-7 text-base">
                Ver suplementos
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/wearables"
                className="inline-flex items-center gap-2 rounded-full px-7 h-12 text-base font-semibold text-white border border-white/25 hover:border-white/50 hover:bg-white/10 transition-all duration-200"
              >
                Ver wearables
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-y border-border/60 bg-card">
        <div className="container py-0">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="py-7 text-center px-4"
              >
                <p className="font-display text-3xl md:text-4xl font-bold brand-gradient-text tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-widest">
                  {s.label}
                </p>
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
                  className="group block bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-primary/25 transition-all duration-300"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className={`${cat.bg} px-8 pt-8 pb-6`}>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      <cat.icon size={26} className="text-white" />
                    </div>
                    <h3 className="font-display text-xl font-bold mt-5">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="px-8 py-4 border-t border-border/40 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Ver productos</span>
                    <ArrowRight
                      size={16}
                      className="text-primary translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
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
                Creemos en{" "}
                <span className="brand-gradient-text">tu potencial</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                En Level Up seleccionamos cada producto con un solo criterio:{" "}
                <strong className="text-foreground">que realmente funcione.</strong>
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Importadores directos de marcas como Dymatize y OstroVit. Desde suplementos
                de grado farmacéutico hasta tecnología wearable de vanguardia.
              </p>
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
      <section className="relative overflow-hidden brand-gradient-bg py-24">
        {/* Subtle noise pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-4">
              Listo para empezar
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
              ¿Qué esperas para<br className="hidden md:block" /> dar el siguiente paso?
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto text-lg leading-relaxed">
              Explora nuestro catálogo completo y encuentra lo que necesitas para rendir al máximo.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              <Link
                to="/suplementos"
                className="inline-flex items-center gap-2 rounded-full px-7 h-12 text-sm font-semibold bg-white text-[hsl(217,84%,57%)] hover:bg-white/95 transition-all duration-200 shadow-lg"
              >
                Ver Suplementos
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/wearables"
                className="inline-flex items-center gap-2 rounded-full px-7 h-12 text-sm font-semibold border border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
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
