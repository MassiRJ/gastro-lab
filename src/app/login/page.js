"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Lock, Mail, ChevronRight, Loader2, ChefHat } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Login exitoso -> Redirigir a Caja (o Cocina)
      router.push("/caja");
      
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-zinc-900 via-black to-black opacity-80"></div>
        <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20"
            alt="Background"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full bg-zinc-900/80 border border-zinc-800 mb-4 shadow-xl">
                <ChefHat className="text-amber-500" size={40} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">
                GASTRO<span className="text-amber-500">.</span>LAB
            </h1>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-2">Acceso Administrativo</p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Corporativo</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="usuario@gastrolab.com"
                            className="w-full bg-black border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-zinc-700"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-zinc-500" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-black border border-zinc-800 text-white pl-12 pr-4 py-3 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all placeholder:text-zinc-700"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-bold">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <>Ingresar al Sistema <ChevronRight size={18}/></>}
                </button>
            </form>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-8">
            &copy; 2025 GastroLab System. Acceso restringido.
        </p>
      </div>
    </div>
  );
}