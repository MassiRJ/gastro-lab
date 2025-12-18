"use client";

import { useState, useEffect } from "react";
import { Calendar, Trash2, User, Phone, Users, Check, XCircle, LogOut, Lock } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function ReservationsAdmin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DEL LOGIN ---
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

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Cargando...</div>;

  // --- LOGIN (MODO CLARO) ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-yellow-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Administración</h1>
            <p className="text-gray-500 text-sm mt-2">Gastro Lab System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Correo</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-yellow-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-yellow-500 focus:outline-none"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD (MODO CLARO) ---
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
            <p className="text-gray-500">Panel de Control</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm shadow-sm text-gray-700">
            <LogOut size={16} /> Salir
          </button>
        </div>

        <div className="grid gap-4">
          {reservations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
              <p className="text-gray-400">Sin reservas pendientes</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl text-center min-w-[100px] border border-gray-100">
                    <p className="text-black font-bold text-xl">{res.time}</p>
                    <p className="text-gray-500 text-sm">{res.date}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                      <User size={18} className="text-gray-400" /> {res.name}
                    </h3>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Phone size={14} /> {res.phone}
                    </p>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Users size={14} /> {res.people} px
                    </p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded border border-green-200 font-medium">
                      Pagado: S/ {res.paid_amount}
                    </span>
                  </div>
                </div>

                <button onClick={() => deleteReservation(res.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-lg transition-colors">
                    <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}