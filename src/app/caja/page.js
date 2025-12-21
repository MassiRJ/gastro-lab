"use client";

import { useState, useEffect } from "react";
// 👇 AQUI FALTABA IMPORTAR CheckCircle, YA ESTA AGREGADO
import { DollarSign, TrendingUp, CreditCard, Calendar, Wallet, Utensils, MapPin, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function CashierView() {
  const [session, setSession] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkSession(); }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
    if (session) fetchTransactions();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { setSession(data.session); fetchTransactions(); }
  };

  const fetchTransactions = async () => {
    try {
      // Leemos de sales_history (donde cocina manda los pedidos terminados)
      const { data, error } = await supabase
        .from("sales_history")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;

      if (data) {
        setTransactions(data);
        // Sumamos el total de forma segura (si es null suma 0)
        const total = data.reduce((sum, item) => sum + (item.total_price || 0), 0);
        setTotalSales(total);
      }
    } catch (err) {
      console.error("Error cargando caja:", err);
    }
  };

  const Background = () => (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-emerald-900 via-teal-900 to-green-950">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando Caja...</div>;

  // --- LOGIN CAJA ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <Background />
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
              <DollarSign className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-white">Caja & Finanzas</h1>
            <p className="text-emerald-200 text-sm mt-2">Control de Ventas Diarias</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:border-emerald-500 outline-none" placeholder="admin@gastrolab.com" />
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/40 focus:border-emerald-500 outline-none" placeholder="******" />
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30">Abrir Caja</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD CAJA ---
  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden text-white">
      <Background />
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* TARJETA RESUMEN SUPERIOR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 backdrop-blur-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-emerald-200 font-medium mb-1">Ventas Totales (Pedidos Cerrados)</p>
              <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                S/ {totalSales.toFixed(2)}
              </h2>
            </div>
            <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
              <DollarSign size={200} />
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col justify-center items-center text-center">
            <div className="bg-white/10 p-4 rounded-full mb-4">
              <Utensils className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-3xl font-bold">{transactions.length}</h3>
            <p className="text-white/50">Pedidos Despachados</p>
          </div>
        </div>

        {/* LISTA DE TRANSACCIONES */}
        <div className="backdrop-blur-xl bg-black/20 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="text-emerald-400" /> Historial de Ventas
            </h3>
            <button onClick={fetchTransactions} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20">Actualizar</button>
          </div>
          
          <div className="divide-y divide-white/10">
            {transactions.length === 0 ? (
                <div className="p-8 text-center text-white/40">No hay ventas registradas aún.</div>
            ) : (
                transactions.map((tx) => (
                <div key={tx.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors gap-4">
                    <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400 hidden md:block">
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-white flex items-center gap-2">
                            <MapPin size={16} className="text-yellow-400"/> Mesa {tx.table_number || "?"}
                        </p>
                        <p className="text-sm text-white/40 flex items-center gap-2">
                        <Calendar size={12} /> 
                        {tx.created_at ? new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                        <span className="text-white/20">|</span> ID: #{tx.id}
                        </p>
                        {/* Mostrar resumen de items CON PROTECCIÓN ANTI-ERROR */}
                        <div className="text-xs text-white/60 mt-1">
                            {tx.items && Array.isArray(tx.items) ? tx.items.map(i => i.title).join(", ") : "Sin detalles"}
                        </div>
                    </div>
                    </div>
                    <div className="text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                    <p className="font-bold text-emerald-400 text-xl">+ S/ {(tx.total_price || 0).toFixed(2)}</p>
                    <p className="text-xs text-white/30 uppercase bg-white/10 px-2 py-1 rounded mt-1">
                        {tx.payment_method || "Efectivo"}
                    </p>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
