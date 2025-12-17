"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ArrowRight, User, Phone, CheckCircle, AlertCircle, Info, Lock } from "lucide-react";
import PaymentModal from "./PaymentModal"; // <--- 1. IMPORTAMOS EL MODAL
import { supabase } from "../../lib/supabaseClient";

const MAX_TABLES_PER_SLOT = 3;
const RESERVATION_FEE = 50.00; // <--- 2. MONTO DE LA GARANTÍA

export default function Reservation() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "20:00",
    people: "2",
    name: "",
    phone: ""
  });
  
  const [status, setStatus] = useState("idle"); 
  const [isFull, setIsFull] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [refresh, setRefresh] = useState(0);
  
  // Nuevo estado para controlar el modal de pago
  const [showPayment, setShowPayment] = useState(false); 

  // --- VALIDACIONES (Igual que antes) ---
  useEffect(() => {
    const allReservations = JSON.parse(localStorage.getItem("restaurant_reservations") || "[]");
    
    const existingCount = allReservations.filter(
      r => r.date === formData.date && r.time === formData.time && r.status !== "cancelada"
    ).length;
    setIsFull(existingCount >= MAX_TABLES_PER_SLOT);

    if (formData.phone.length > 8) {
        const userHasBooking = allReservations.some(
            r => r.date === formData.date && r.time === formData.time && r.phone === formData.phone && r.status !== "cancelada"
        );
        setAlreadyBooked(userHasBooking);
    } else {
        setAlreadyBooked(false);
    }
  }, [formData.date, formData.time, formData.phone, refresh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. PRIMER PASO: VALIDAR Y ABRIR MODAL DE PAGO ---
  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (isFull || alreadyBooked) return;
    
    // En lugar de guardar, abrimos el modal para cobrar
    setShowPayment(true);
  };

  // --- 4. SEGUNDO PASO: GUARDAR DESPUÉS DE PAGAR ---
// ... código de insert ...
    const { data, error } = await supabase
      .from('reservations')
      .insert([newReservation]);

    if (error) {
      console.error("Error guardando:", error);
      // --- AGREGAMOS ESTA LÍNEA PARA VER EL ERROR EN EL CELULAR ---
      alert("ERROR TÉCNICO: " + error.message + "\nCódigo: " + error.code); 
      // -----------------------------------------------------------
      setStatus("idle");
      return;
    }

    // Preparamos el objeto para Supabase (nombres de columnas en inglés como en la tabla)
    const newReservation = {
      date: formData.date,
      time: formData.time,
      people: formData.people,
      name: formData.name,
      phone: formData.phone,
      status: "confirmada",
      paid_amount: RESERVATION_FEE,
      payment_method: paymentDetails.method,
      payment_status: "PAGADO"
    };

    // --- GUARDAR EN SUPABASE ---
    const { data, error } = await supabase
      .from('reservations')
      .insert([newReservation]);

    if (error) {
      console.error("Error guardando:", error);
      alert("Hubo un error al guardar tu reserva. Contáctanos.");
      setStatus("idle");
      return;
    }
    // ---------------------------

    setStatus("success");
    setRefresh(prev => prev + 1);

    setTimeout(() => {
      setStatus("idle");
      setFormData({ ...formData, name: "", phone: "" });
    }, 4000);
  };

  return (
    <section id="reservas" className="relative py-20 bg-black overflow-hidden scroll-mt-28">
      
      {/* MODAL DE PAGO DE GARANTÍA */}
      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={RESERVATION_FEE} // Cobramos 50 soles
        onPaymentSuccess={handlePaymentSuccess}
        allowCash={false}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000" 
              alt="Ambiente exclusivo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-3xl font-bold text-white mb-2">Reserva con Garantía</h3>
              <p className="text-gray-300 text-sm mb-4 max-w-md">
                Para asegurar la calidad de nuestro servicio, solicitamos un depósito de garantía que será descontado de su consumo final.
              </p>
              <div className="flex gap-2 text-yellow-500 text-xs font-bold uppercase tracking-wider">
                <span className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1">
                  <Lock size={12}/> Pago Seguro
                </span>
                <span className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/30">
                  Yape / Plin / Tarjetas
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/50 p-8 md:p-12 rounded-3xl border border-zinc-800 backdrop-blur-sm"
          >
            {status === "success" ? (
              <div className="text-center py-20 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-black" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">¡Reserva Asegurada!</h3>
                <p className="text-gray-400">Hemos recibido tu garantía de S/ {RESERVATION_FEE.toFixed(2)}.</p>
                <p className="text-gray-500 text-sm mt-4">Te esperamos el {formData.date} a las {formData.time}.</p>
              </div>
            ) : (
              <form onSubmit={handlePreSubmit} className="space-y-6">
                <div className="text-center lg:text-left mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Reserva tu mesa</h2>
                  <p className="text-gray-400">Garantía de reserva: <span className="text-yellow-500 font-bold">S/ {RESERVATION_FEE.toFixed(2)}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                      <Calendar size={16} /> Fecha
                    </label>
                    <input 
                      type="date" 
                      name="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                      <Clock size={16} /> Hora
                    </label>
                    <select 
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                      <option value="19:00">07:00 PM</option>
                      <option value="20:00">08:00 PM</option>
                      <option value="21:00">09:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                    </select>
                  </div>
                </div>

                {isFull && (
                  <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 animate-pulse">
                    <AlertCircle size={24} />
                    <div>
                      <p className="font-bold">Horario Agotado</p>
                      <p className="text-xs text-red-300">Por favor elige otra hora.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                    <Users size={16} /> Personas
                  </label>
                  <select 
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                    className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
                  >
                    <option value="2">2 Personas</option>
                    <option value="4">4 Personas</option>
                    <option value="6">6 Personas</option>
                    <option value="8">8 Personas</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                      <User size={16} /> Nombre
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isFull}
                      className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none disabled:opacity-50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                      <Phone size={16} /> Celular
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isFull}
                      className="w-full bg-zinc-800 border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none disabled:opacity-50" 
                    />
                  </div>
                </div>

                {alreadyBooked && (
                  <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-xl flex items-center gap-3 text-yellow-200 mb-4 animate-in fade-in slide-in-from-bottom-2">
                    <AlertCircle size={24} />
                    <div>
                      <p className="font-bold">Ya tienes una reserva</p>
                      <p className="text-xs">Este número ya está registrado.</p>
                    </div>
                  </div>
                )}

                <button 
                  disabled={status === "loading" || isFull || alreadyBooked}
                  className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-gray-500"
                >
                  {status === "loading" ? "Procesando..." 
                    : isFull ? "Sin Cupos" 
                    : alreadyBooked ? "Reserva Duplicada" 
                    : `Pagar Garantía (S/ ${RESERVATION_FEE})`} 
                  {!status === "loading" && !isFull && !alreadyBooked && <ArrowRight size={20} />}
                </button>
                
                <p className="text-xs text-center text-gray-500">
                  * Pago seguro encriptado. Reembolsable hasta 24h antes.
                </p>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}