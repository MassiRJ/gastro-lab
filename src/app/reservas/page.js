"use client";

import { useState, useEffect } from "react";
import { Calendar, Trash2, User, Phone, Users, CheckCircle, LogOut, Lock, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ReservationsAdmin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (session) fetchReservations();
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError("Credenciales incorrectas.");
    } else {
      setSession(data.session);
      fetchReservations();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setReservations([]);
  };

  const fetchReservations = async () => {
    const { data } = await supabase.from("reservations").select("*").order("date", { ascending: true });
    if (data) setReservations(data);
  };

  const deleteReservation = async (id) => {
    if (!window.confirm("¿Eliminar reserva?")) return;
    const { error } = await supabase.from("reservations").delete().match({ id });
    if (!error) setReservations(reservations.filter((r) => r.id !== id));
  };

  if (loading) return <div className="min-h-screen bg-indigo-900 flex items-center justify-center text-white">Cargando interfaz...</div>;

  // --- FONDO ANIMADO (GRADIENTE) ---
  const Background = () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );

  // --- LOGIN (GLASSMORPHISM) ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Background />
        
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Access</h1>
            <p className="text-blue-200 text-sm mt-2">Bienvenido de nuevo, Jefe.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs text-blue-200 uppercase tracking-wider font-bold ml-1">Correo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                placeholder="admin@gastrolab.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-blue-200 uppercase tracking-wider font-bold ml-1">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-lg text-red-200 text-sm text-center backdrop-blur-sm">
                {loginError}
              </div>
            )}

            <button type="submit" className="w-full bg-white text-indigo-900 font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-95">
              Desbloquear Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (GLASSMORPHISM) ---
  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden text-white">
      <Background />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
              Panel de Control
            </h1>
            <p className="text-blue-200 flex items-center gap-2 mt-1">
              <Sparkles size={16} className="text-yellow-400" />
              Gestión de reservas en tiempo real
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 text-sm font-medium backdrop-blur-sm"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </header>

        <div className="grid gap-6">
          {reservations.length === 0 ? (
            <div className="text-center py-32 backdrop-blur-xl bg-black/20 rounded-3xl border border-white/5">
              <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                <Calendar size={48} className="text-white/30" />
              </div>
              <p className="text-white/50 text-lg">El sistema está esperando reservas...</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="group backdrop-blur-lg bg-white/10 hover:bg-white/15 border border-white/10 p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="bg-gradient-to-b from-white/20 to-white/5 p-5 rounded-2xl text-center min-w-[110px] border border-white/10 shadow-inner">
                    <p className="text-white font-bold text-2xl drop-shadow-md">{res.time}</p>
                    <p className="text-blue-200 text-xs uppercase tracking-widest">{res.date}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-2xl text-white flex items-center gap-3">
                      {res.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-blue-100">
                      <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                        <Phone size={12} /> {res.phone}
                      </span>
                      <span className="flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full border border-white/5">
                        <Users size={12} /> {res.people} Personas
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-green-300 text-sm mt-1">
                        <CheckCircle size={14} />
                        <span className="font-medium">Pagado: S/ {res.paid_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <button 
                    onClick={() => deleteReservation(res.id)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/30 px-6 py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] group-hover:scale-105"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}