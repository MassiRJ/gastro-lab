"use client";

import { useState, useEffect } from "react";
import { Calendar, Trash2, User, Phone, Users, Check, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // <--- IMPORTANTE

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);

  // Cargar reservas desde la Nube
  useEffect(() => {
    const fetchReservations = async () => {
      // Pedimos todo a la tabla 'reservations', ordenado por ID descendente
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('id', { ascending: false });
      
      if (data) setReservations(data);
    };

    fetchReservations();
    
    // Polling cada 5 segs (luego lo haremos Realtime)
    const interval = setInterval(fetchReservations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar estado en la Nube
  const updateStatus = async (id, newStatus) => {
    // 1. Actualizamos visualmente rápido (Optimistic UI)
    const updatedLocal = reservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReservations(updatedLocal);

    // 2. Enviamos el cambio a la base de datos
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) console.error("Error actualizando:", error);
  };

  // ... (El resto del renderizado sigue igual, solo cambia cómo obtenemos los datos)

  const getStatusBadge = (status) => {
    switch(status) {
      case "confirmada": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Confirmada</span>;
      case "en_mesa": return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">En Mesa</span>;
      case "no_show": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">No Vino</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">Pendiente</span>;
    }
  };

  const deleteReservation = (id) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem("restaurant_reservations", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-zinc-800 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-2">
              <Calendar className="text-purple-600" /> Libro de Reservas
            </h1>
            <p className="text-gray-500">Gestión de tolerancia y asistencia</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
            <span className="block text-xs text-gray-400 uppercase font-bold">Total Reservas</span>
            <span className="block text-2xl font-bold text-purple-600">{reservations.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => (
            <div key={res.id} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative group ${res.status === 'no_show' ? 'opacity-60 grayscale' : ''}`}>
              
              {/* Botón Eliminar (Visible en Hover) */}
              <button 
                  onClick={() => deleteReservation(res.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Borrar del sistema"
                >
                  <Trash2 size={18} />
              </button>

              {/* Header con Estado y PAGO (MODIFICADO) */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                   <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold w-fit">
                    {res.time}
                  </span>
                  {/* SELLO DE GARANTÍA */}
                  {res.paymentStatus === "PAGADO" && (
                     <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                        S/ {res.paidAmount} PAGADO ({res.paymentMethod})
                     </span>
                  )}
                </div>
                {getStatusBadge(res.status || 'confirmada')}
              </div>

              {/* Datos del Cliente */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={18} />
                  <span className="font-bold text-gray-900 text-lg">{res.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="text-gray-400" size={18} />
                  <span>Mesa para {res.people}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="text-gray-400" size={18} />
                  <a href={`tel:${res.phone}`} className="hover:text-purple-600 underline decoration-dotted">
                    {res.phone}
                  </a>
                </div>
              </div>

              {/* BOTONES DE GESTIÓN (ANFITRIONA) */}
              {res.status !== 'no_show' && res.status !== 'en_mesa' && (
                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => updateStatus(res.id, "en_mesa")}
                    className="flex items-center justify-center gap-1 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-bold text-sm transition-colors"
                  >
                    <Check size={16} /> LLEGÓ
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm("¿Marcar como NO ASISTIÓ? Esto liberará el cupo.")) updateStatus(res.id, "no_show");
                    }}
                    className="flex items-center justify-center gap-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-bold text-sm transition-colors"
                  >
                    <XCircle size={16} /> NO VINO
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-400 text-center">
                Fecha: {res.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}