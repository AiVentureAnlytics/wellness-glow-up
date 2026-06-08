import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { getCartTotal, formatCLP, getShippingQuote, type ShipitQuote } from "@/lib/cart";
import { filterCommunes, getRegionLabel, type ShipitCommune } from "@/lib/shipit-communes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, ArrowRight, ShoppingBag, Truck, CreditCard } from "lucide-react";
import { formatRut, isValidRut } from "@/lib/rut";

export default function Checkout() {
  const cart = useCart();
  const subtotal = getCartTotal(cart);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", rut: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Communes list (fetched on mount)
  const [communes, setCommunes] = useState<ShipitCommune[]>([]);
  const [communesLoading, setCommunesLoading] = useState(true);

  // Commune combobox
  const [communeSearch, setCommuneSearch] = useState("");
  const [commune, setCommune] = useState<ShipitCommune | null>(null);
  const [communeOpen, setCommuneOpen] = useState(false);
  const communeRef = useRef<HTMLDivElement>(null);

  // Shipping quotes
  const [quotes, setQuotes] = useState<ShipitQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<ShipitQuote | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  // Fetch full communes list once on mount
  useEffect(() => {
    fetch("/api/shipit/communes")
      .then((r) => r.json())
      .then((data: unknown) => {
        setCommunes(Array.isArray(data) ? (data as ShipitCommune[]) : []);
      })
      .catch(() => {})
      .finally(() => setCommunesLoading(false));
  }, []);

  // Close commune dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (communeRef.current && !communeRef.current.contains(e.target as Node)) {
        setCommuneOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Fetch shipping quotes when commune changes
  const communeId = commune?.id ?? null;
  useEffect(() => {
    if (communeId === null) {
      setQuotes([]);
      setSelectedQuote(null);
      return;
    }
    let cancelled = false;
    setShippingLoading(true);
    setQuotes([]);
    setSelectedQuote(null);
    const items = cart.map((i) => ({ id: i.id, quantity: i.qty }));
    void getShippingQuote(communeId, items, subtotal).then((result) => {
      if (cancelled) return;
      setQuotes(result.quotes);
      setSelectedQuote(result.quotes[0] ?? null); // pre-select cheapest
      setShippingLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communeId]);

  const orderTotal = subtotal + (selectedQuote?.price ?? 0);
  const filteredCommunes = filterCommunes(communes, communeSearch);

  function handleCommuneInput(value: string) {
    setCommuneSearch(value);
    setCommuneOpen(true);
    if (commune) {
      setCommune(null);
      setQuotes([]);
      setSelectedQuote(null);
    }
  }

  function handleCommuneSelect(c: ShipitCommune) {
    setCommune(c);
    setCommuneSearch(c.name);
    setCommuneOpen(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.commune;
      return next;
    });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Ingresa tu nombre";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if (!form.phone.trim()) e.phone = "Ingresa tu teléfono";
    if (!form.rut.trim()) e.rut = "Ingresa tu RUT";
    else if (!isValidRut(form.rut)) e.rut = "RUT inválido (ej: 12.345.678-9)";
    if (!form.address.trim()) e.address = "Ingresa tu dirección de despacho";
    if (!commune) e.commune = "Selecciona tu comuna de despacho";
    if (!selectedQuote) e.commune = "Selecciona un servicio de envío";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    navigate("/pago/mercadopago", {
      state: {
        customer: {
          ...form,
          commune_id: commune!.id,
          commune_name: commune!.name,
        },
        cart,
        total: orderTotal,
        shippingCost: selectedQuote!.price,
        courierName: selectedQuote!.courierName,
      },
    });
  }

  if (cart.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground/30" />
        <h1 className="font-display text-2xl font-bold mt-6">Tu carrito está vacío</h1>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/suplementos">Ver Suplementos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Pasos */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
          <span className="font-semibold text-primary">Tus datos</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
          <span className="text-muted-foreground">Pagar</span>
          <span className="text-muted-foreground mx-1">→</span>
          <span className="bg-muted text-muted-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
          <span className="text-muted-foreground">Confirmación</span>
        </div>

        <h1 className="font-display text-3xl font-bold mb-8">Datos de envío</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User size={14} /> Nombre completo
            </Label>
            <Input
              id="name"
              placeholder="Ej: María González"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={14} /> Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={14} /> Teléfono
            </Label>
            <Input
              id="phone"
              placeholder="+56 9 1234 5678"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* RUT */}
          <div className="space-y-2">
            <Label htmlFor="rut" className="flex items-center gap-2">
              <CreditCard size={14} /> RUT
            </Label>
            <Input
              id="rut"
              placeholder="12.345.678-9"
              value={form.rut}
              onChange={(e) => setForm({ ...form, rut: formatRut(e.target.value) })}
              className={errors.rut ? "border-destructive" : ""}
              maxLength={12}
            />
            {errors.rut && <p className="text-xs text-destructive">{errors.rut}</p>}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin size={14} /> Dirección de despacho
            </Label>
            <Input
              id="address"
              placeholder="Calle, número, departamento"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          {/* Comuna */}
          <div className="space-y-2">
            <Label htmlFor="commune" className="flex items-center gap-2">
              <Truck size={14} /> Comuna de despacho *
            </Label>
            <div className="relative" ref={communeRef}>
              <Input
                id="commune"
                placeholder={communesLoading ? "Cargando comunas..." : "Busca tu comuna..."}
                disabled={communesLoading}
                value={communeSearch}
                onChange={(e) => handleCommuneInput(e.target.value)}
                onFocus={() => { if (communeSearch.length > 0 && !commune) setCommuneOpen(true); }}
                autoComplete="off"
                className={errors.commune ? "border-destructive" : ""}
              />
              {communeOpen && filteredCommunes.length > 0 && (
                <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {filteredCommunes.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCommuneSelect(c);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {commune && (
              <p className="text-xs text-green-600 font-medium">
                ✓ {commune.name}{getRegionLabel(commune.id) ? ` · ${getRegionLabel(commune.id)}` : ""}
              </p>
            )}
            {errors.commune && <p className="text-xs text-destructive">{errors.commune}</p>}
          </div>

          {/* Courier selector */}
          {commune && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Servicio de envío</Label>
              {shippingLoading ? (
                <p className="text-sm text-muted-foreground py-1">Calculando opciones de envío…</p>
              ) : quotes.length === 0 ? (
                <p className="text-sm text-destructive py-1">Sin couriers disponibles para esta comuna.</p>
              ) : (
                <div className="space-y-2">
                  {quotes.map((q, i) => {
                    const label = q.courierName
                      ? q.courierName.charAt(0).toUpperCase() + q.courierName.slice(1)
                      : "Envío estándar";
                    const isSelected = selectedQuote?.courierName === q.courierName;
                    return (
                      <label
                        key={i}
                        className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="courier"
                            checked={isSelected}
                            onChange={() => setSelectedQuote(q)}
                            className="accent-primary shrink-0"
                          />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-semibold">{formatCLP(q.price)}</span>
                          {q.deliveryDate && (
                            <span className="text-xs text-muted-foreground ml-2">
                              · Llega {q.deliveryDate}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Resumen */}
          <div className="bg-muted/50 rounded-xl p-4 mt-6 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Resumen del pedido</p>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span>{formatCLP(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
              <span>Subtotal</span>
              <span>{formatCLP(subtotal)}</span>
            </div>

            {/* Shipping row */}
            {!commune ? (
              <p className="text-xs text-muted-foreground text-right italic">
                Selecciona tu comuna para ver el costo de envío
              </p>
            ) : shippingLoading ? (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Envío</span>
                <span>Calculando…</span>
              </div>
            ) : selectedQuote && selectedQuote.price === 0 ? (
              <div className="flex justify-between text-sm text-green-600 font-semibold">
                <span>Envío</span>
                <span>Envío gratis 🎉</span>
              </div>
            ) : selectedQuote ? (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="font-medium">{formatCLP(selectedQuote.price)}</span>
              </div>
            ) : null}

            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">
                {selectedQuote !== null ? formatCLP(orderTotal) : formatCLP(subtotal)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!commune || !selectedQuote || shippingLoading}
            className="w-full brand-gradient-bg text-primary-foreground rounded-full h-14 text-lg font-semibold gap-2 mt-4 disabled:opacity-50"
          >
            Continuar al pago
            <ArrowRight size={20} />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
