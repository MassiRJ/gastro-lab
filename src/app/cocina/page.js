"use client";

import { useState, useEffect } from "react";
import { Clock, Users, CheckCircle, Utensils, Lock, Flame } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function KitchenDisplay() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
    if (session) fetchOrders();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("Acceso denegado.");
    else { setSession(data.session); fetchOrders(); }
  };

  const fetchOrders = async () => {
    // Solo traemos las confirmadas, no las canceladas ni las ya servidas
    const { data } = await supabase
      .from("reservations")
      .select("*")
      .eq('status', 'confirmada') 
      .order("time", { ascending: true });
    if (data) setOrders(data);
  };

  const markAsServed = async (id) => {
    // Marcamos como "atendida" para que desaparezca de la cocina pero quede en la base de datos
    const { error } = await supabase
      .from("reservations")
      .update({ status: 'atendida' })
      .eq('id', id);
      
    if (!error) {
      // Efecto visual de eliminar
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const Background = () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-900 via-red-900 to-rose-900">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando Cocina...</div>;

  // --- LOGIN COCINA ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Background />
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform -rotate-3">
              <Flame className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white">Modo Cocina</h1>
            <p className="text-orange-200 text-sm mt-2">Kitchen Display System</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:border-orange-500 outline-none" placeholder="Chef Access" />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:border-orange-500 outline-none" placeholder="******" />
            {loginError && <p className="text-red-300 text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30">Entrar a Cocina</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD COCINA ---
  return (
    <div className="min-h-screen p-6 relative overflow-hidden text-white">
      <Background />
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-10 backdrop-blur-md bg-black/20 p-6 rounded-3xl border border-white/10">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Utensils className="text-orange-400" /> Comandas Pendientes
          </h1>
          <div className="bg-orange-500/20 px-6 py-2 rounded-full border border-orange-500/50">
            <span className="font-bold text-orange-200">{orders.length} en cola</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.length === 0 ? (
            <div className="col-span-full text-center py-40 opacity-50">
              <CheckCircle size={80} className="mx-auto mb-4 text-green-400" />
              <h2 className="text-3xl font-bold">¡Todo limpio, Chef!</h2>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-between h-full hover:border-orange-500/50 transition-all duration-300 group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                      <p className="text-3xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-orange-400" /> {order.time}
                      </p>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-lg">
                      <p className="text-xs uppercase tracking-wider text-white/60">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 truncate">{order.name}</h3>
                    <div className="flex items-center gap-2 text-xl text-orange-200 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                      <Users size={24} /> 
                      <span className="font-bold">{order.people} Personas</span>
                    </div>
                    <p className="mt-4 text-white/50 text-sm italic">Nota: Sin alergias registradas</p>
                  </div>
                </div>

                <button 
                  onClick={() => markAsServed(order.id)}
                  className="w-full bg-green-500/20 hover:bg-green-500 hover:text-black text-green-300 border border-green-500/50 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <CheckCircle size={24} />
                  MARCAR LISTO
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}