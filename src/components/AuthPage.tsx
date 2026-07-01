import { useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "login" | "signup";

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Correo o contraseña incorrectos.";
  if (msg.includes("Email not confirmed"))
    return "Debes confirmar tu correo electrónico antes de entrar.";
  if (msg.includes("User already registered"))
    return "Este correo ya tiene una cuenta. Inicia sesión.";
  if (msg.includes("Password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (msg.includes("Unable to validate email address"))
    return "El formato del correo no es válido.";
  return "Ocurrió un error. Inténtalo de nuevo.";
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function reset() {
    setError("");
    setInfo("");
  }

  function switchMode(next: Mode) {
    setMode(next);
    setEmail("");
    setPassword("");
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(translateError(error.message));
      // on success onAuthStateChange in useAuth updates the session automatically
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(translateError(error.message));
      } else {
        setInfo("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
      }
    }

    setLoading(false);
  }

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      {/* Top band — same gradient as the main app header */}
      <div className="auth-hero">
        <h1 className="auth-app-name">Mi mes financiero</h1>
        <p className="auth-app-tagline">Controla tu plata. Cuida tu futuro.</p>
      </div>

      {/* Form card */}
      <div className="auth-card card">
        <h2 className="auth-card-title">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        {info && <p className="auth-info">{info}</p>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field">
            <label htmlFor="auth-email">Correo electrónico</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="auth-password">Contraseña</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "Tu contraseña" : "Mínimo 6 caracteres"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Un momento…"
              : isLogin ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => switchMode(isLogin ? "signup" : "login")}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
