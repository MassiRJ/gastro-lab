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

  // --- ESTADOS DE LAS RESERVAS ---
  const [reservations, setReservations] = useState([]);

  // 1. VERIFICAR SI YA HAY SESIÓN AL CARGAR
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      if (session) fetchReservations(); // Si ya estaba logueado, carga los datos
    };
    checkSession();
  }, []);

  // 2. FUNCIÓN PARA INICIAR SESIÓN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Credenciales incorrectas. Intenta de nuevo.");
    } else {
      setSession(data.session);
      fetchReservations(); // Cargar datos al entrar
    }
  };

  // 3. FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setReservations([]);
  };

  // 4. TRAER DATOS (Solo se ejecuta si hay sesión)
  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true });
    
    if (data) setReservations(data);
  };

  const deleteReservation = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta reserva?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("reservations").delete().match({ id });
    if (!error) {
      setReservations(reservations.filter((r) => r.id !== id));
    }
  };

  // --- PANTALLA DE CARGA ---
  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando sistema...</div>;

  // --- SI NO HAY SESIÓN, MOSTRAMOS EL LOGIN ---
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
              <Lock className="text-yellow-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Acceso Administrativo</h1>
            <p className="text-gray-400 text-sm mt-2">Solo personal autorizado</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none"
                placeholder="admin@gastrolab.com"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- SI HAY SESIÓN, MOSTRAMOS EL DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">Panel de Control</h1>
            <p className="text-gray-400">Gestiona tus reservas en tiempo real</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        <div className="grid gap-4">
          {reservations.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800">
              <p className="text-gray-500">No hay reservas pendientes</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-yellow-500/30 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="bg-zinc-800 p-4 rounded-xl text-center min-w-[100px]">
                    <p className="text-yellow-500 font-bold text-xl">{res.time}</p>
                    <p className="text-gray-400 text-sm">{res.date}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <User size={18} className="text-gray-400" /> {res.name}
                    </h3>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Phone size={14} /> {res.phone}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Users size={14} /> {res.people} Personas
                    </p>
                    <span className="inline-block px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-900">
                      Pago: S/ {res.paid_amount} ({res.payment_status})
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => deleteReservation(res.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-900/20 text-red-400 px-4 py-3 rounded-xl hover:bg-red-900/40 transition-colors border border-red-900/30"
                  >
                    <Trash2 size={18} /> Cancelar
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