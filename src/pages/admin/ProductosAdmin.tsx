import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";
import {
  createDbProduct,
  updateDbProduct,
  hardDeleteDbProduct,
  uploadProductImage,
  slugify,
  type ProductInput,
} from "@/lib/dbProducts";
import type { Category, Product } from "@/lib/products";
import { formatCLP } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Loader2, Upload, X, ShieldAlert, Package,
} from "lucide-react";

const ADMIN_EMAIL = "cjhealthsupply@gmail.com";

const SECTIONS: { value: ProductInput["section"]; label: string }[] = [
  { value: "Suplementos", label: "Suplementos" },
  { value: "Wellness", label: "Wellness" },
  { value: "Wearables", label: "Wearables" },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "proteinas", label: "Proteínas" },
  { value: "creatinas", label: "Creatinas" },
  { value: "vitaminas", label: "Vitaminas & Minerales" },
  { value: "energia", label: "Energía" },
  { value: "wellness", label: "Wellness" },
  { value: "wearables", label: "Wearables" },
];

interface FormState {
  id: string;
  name: string;
  description: string;
  detailsRaw: string;
  price: string;
  img: string;
  category: Category;
  section: ProductInput["section"];
  badge: string;
  stock: string;
  isEditing: boolean;
}

const emptyForm: FormState = {
  id: "",
  name: "",
  description: "",
  detailsRaw: "",
  price: "",
  img: "",
  category: "proteinas",
  section: "Suplementos",
  badge: "",
  stock: "999",
  isEditing: false,
};

export default function ProductosAdmin() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  // Auto-slug cuando escriben el nombre y no están editando
  useEffect(() => {
    if (!form.isEditing && form.name && !form.id) {
      setForm((f) => ({ ...f, id: slugify(f.name) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.isEditing]);

  if (authLoading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="container py-20 max-w-md text-center">
        <ShieldAlert size={64} className="mx-auto text-destructive/60 mb-4" />
        <h1 className="font-display text-2xl font-bold">Acceso restringido</h1>
        <p className="text-muted-foreground mt-2">
          Esta página es solo para el admin de Level Up.
        </p>
        <Button asChild className="mt-6 brand-gradient-bg text-primary-foreground rounded-full px-8">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    );
  }

  function resetForm() {
    setForm(emptyForm);
    setShowForm(false);
  }

  function editProduct(p: Product) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      detailsRaw: p.details.join("\n"),
      price: String(p.price),
      img: p.img,
      category: p.category,
      section: p.section,
      badge: p.badge ?? "",
      stock: String(p.stock),
      isEditing: true,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, img: url }));
      toast.success("Imagen subida");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.name || !form.price || !form.img) {
      toast.error("Completa nombre, precio e imagen");
      return;
    }
    setSaving(true);
    const payload: ProductInput = {
      id: form.id,
      name: form.name,
      description: form.description,
      details: form.detailsRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      price: parseInt(form.price, 10),
      img: form.img,
      category: form.category,
      section: form.section,
      badge: form.badge || undefined,
      stock: parseInt(form.stock, 10) || 0,
      active: true,
    };
    try {
      if (form.isEditing) {
        await updateDbProduct(form.id, payload);
        toast.success("Producto actualizado");
      } else {
        await createDbProduct(payload);
        toast.success("Producto creado");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error guardando");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}" definitivamente?`)) return;
    try {
      await hardDeleteDbProduct(p.id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error eliminando");
    }
  }

  const filtered = filter
    ? products.filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.id.toLowerCase().includes(filter.toLowerCase())
      )
    : products;

  return (
    <div className="container py-12 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Admin
            </span>
            <h1 className="font-display text-3xl font-bold mt-2">Productos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {products.length} productos · {products.filter((p) => p.stock > 0).length} con stock
            </p>
          </div>
          <Button
            onClick={() => { setForm(emptyForm); setShowForm(!showForm); }}
            className="brand-gradient-bg text-primary-foreground rounded-full font-semibold gap-2"
          >
            {showForm ? <><X size={16} /> Cancelar</> : <><Plus size={16} /> Nuevo producto</>}
          </Button>
        </div>

        {/* Formulario */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-card border rounded-2xl p-6 card-elevated mb-8 space-y-4"
          >
            <h2 className="font-display font-bold text-lg">
              {form.isEditing ? `Editar: ${form.name}` : "Nuevo producto"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>ID (slug, autogenerado)</Label>
                <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} disabled={form.isEditing} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción corta</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ej: 908g · Chocolate · 25g proteína" />
            </div>

            <div className="space-y-2">
              <Label>Características (una por línea)</Label>
              <Textarea
                rows={5}
                value={form.detailsRaw}
                onChange={(e) => setForm({ ...form, detailsRaw: e.target.value })}
                placeholder={`25g de proteína por porción\nSin gluten\n908g por envase`}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Precio (CLP, sin puntos)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Badge (opcional)</Label>
                <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Ej: Top venta" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sección</Label>
                <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v as ProductInput["section"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen</Label>
              <div className="flex items-center gap-3">
                {form.img && (
                  <img src={form.img} alt="" className="w-20 h-20 rounded-lg object-cover border" />
                )}
                <div className="flex-1 flex gap-2">
                  <Input
                    value={form.img}
                    onChange={(e) => setForm({ ...form, img: e.target.value })}
                    placeholder="URL de imagen o sube una"
                    className="flex-1"
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                    <span className="inline-flex items-center gap-2 bg-muted hover:bg-muted/70 rounded-md px-4 h-10 text-sm font-semibold transition-colors">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      Subir
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving} className="brand-gradient-bg text-primary-foreground rounded-full gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {form.isEditing ? "Guardar cambios" : "Crear producto"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">Cancelar</Button>
            </div>
          </motion.form>
        )}

        {/* Búsqueda */}
        <div className="mb-4">
          <Input
            placeholder="Buscar por nombre o ID…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Tabla */}
        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Producto</th>
                    <th className="text-left p-3 font-semibold">Sección</th>
                    <th className="text-right p-3 font-semibold">Precio</th>
                    <th className="text-right p-3 font-semibold">Stock</th>
                    <th className="text-right p-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={p.img} alt="" className="w-10 h-10 rounded object-cover bg-white" />
                          <div>
                            <p className="font-semibold">{p.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-xs bg-muted px-2 py-1 rounded">{p.section}</span>
                      </td>
                      <td className="p-3 text-right font-semibold">{formatCLP(p.price)}</td>
                      <td className="p-3 text-right">
                        <span className={`font-semibold ${p.stock === 0 ? "text-destructive" : p.stock <= 5 ? "text-yellow-600" : "text-foreground"}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => editProduct(p)} className="rounded-full">
                            <Pencil size={14} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(p)} className="rounded-full text-destructive">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Package size={40} className="mx-auto opacity-40 mb-2" />
                <p>No hay productos {filter && "que coincidan"}.</p>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          También puedes editar productos directamente desde el Table Editor de Supabase.
        </p>
      </motion.div>
    </div>
  );
}
