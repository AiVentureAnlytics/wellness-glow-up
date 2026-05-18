import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import logoSrc from "@/assets/levelup-lockup.svg";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    toast.success("¡Bienvenido!");
    navigate(redirectTo);
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
    // On success, OAuth redirect happens automatically
  }

  return (
    <div className="container py-12 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <img src={logoSrc} alt="Level Up" className="h-10 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold">Iniciar sesión</h1>
          <p className="text-muted-foreground text-sm mt-1">Bienvenido de vuelta</p>
        </div>

        <div className="bg-card border rounded-2xl p-6 card-elevated">
          {/* Google */}
          <Button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            variant="outline"
            className="w-full h-12 rounded-full font-semibold gap-2"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
            )}
            Continuar con Google
          </Button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">o con email</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail size={14} /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-sm">
                <Lock size={14} /> Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full font-semibold brand-gradient-bg text-primary-foreground gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Ingresar <ArrowRight size={16} /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-primary font-semibold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          También puedes{" "}
          <Link to="/checkout" className="underline hover:text-foreground">
            comprar como invitado
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
