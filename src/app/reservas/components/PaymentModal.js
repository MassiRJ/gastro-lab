"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Lock, CheckCircle, Loader2, Store } from "lucide-react";

// Aceptamos una nueva prop: allowCash (Por defecto es true)
export default function PaymentModal({ isOpen, onClose, total, onPaymentSuccess, allowCash = true }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("method-selection"); 

  // Pagar en Caja (Solo funciona si allowCash es true)
  const handleCashPayment = () => {
    setLoading(true);
    setStep("processing");
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess({ status: "PENDIENTE", method: "CAJA / EFECTIVO" });
        setStep("method-selection");
      }, 1500);
    }, 1000);
  };

  // Pagar Online (Tarjeta)
  const handleCardPayment = (e) => {
    e.preventDefault();
    setLoading(true);
    setStep("processing");
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess({ status: "PAGADO", method: "TARJETA ONLINE" });
        setStep("method-selection");
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[70] p-4"
          >
            <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
              
              {!loading && step !== "success" && (
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              )}

              {/* --- PASO 1: SELECCIÓN --- */}
              {step === "method-selection" && (
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Método de Pago</h3>
                  <p className="text-gray-400 mb-8">
                    {allowCash 
                      ? `Elige cómo pagar S/ ${total.toFixed(2)}`
                      : `Garantía requerida: S/ ${total.toFixed(2)}`
                    }
                  </p>

                  <div className="space-y-4">
                    {/* Botón Tarjeta (SIEMPRE VISIBLE) */}
                    <button 
                      onClick={() => setStep("card-form")}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-500 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                    >
                      <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                        <CreditCard size={24} />
                      </div>
                      <div className="text-left">
                        <span className="block font-bold">Tarjeta / Yape / Plin</span>
                        <span className="text-xs text-gray-400">Pago seguro inmediato</span>
                      </div>
                    </button>

                    {/* Botón Caja (SOLO SI ALLOWCASH ES TRUE) */}
                    {allowCash && (
                      <button 
                        onClick={handleCashPayment}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-green-500 text-white p-4 rounded-xl flex items-center gap-4 transition-all group"
                      >
                        <div className="bg-green-500/10 p-3 rounded-full text-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                          <Store size={24} />
                        </div>
                        <div className="text-left">
                          <span className="block font-bold">Pagar en Caja / POS</span>
                          <span className="text-xs text-gray-400">Efectivo al recibir</span>
                        </div>
                      </button>
                    )}
                    
                    {!allowCash && (
                      <p className="text-xs text-red-400 mt-4 bg-red-900/20 p-2 rounded">
                        * Al ser una reserva, el pago en caja no está disponible.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* --- PASO 2: FORMULARIO TARJETA --- */}
              {step === "card-form" && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setStep("method-selection")} className="text-gray-500 hover:text-white text-sm">
                      ← Volver
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Datos de Pago</h3>
                  
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-bold uppercase">Número de Tarjeta</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white mt-1 outline-none focus:border-yellow-500" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-bold uppercase">Expiración</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white mt-1 outline-none focus:border-yellow-500" required />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-bold uppercase">CVC</label>
                        <input type="text" placeholder="123" className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white mt-1 outline-none focus:border-yellow-500" required />
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-yellow-500 text-black font-bold py-4 rounded-xl flex justify-center items-center gap-2">
                      <Lock size={16} /> Pagar S/ {total.toFixed(2)}
                    </button>
                  </form>
                </div>
              )}

              {/* --- PROCESANDO --- */}
              {step === "processing" && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={48} className="text-yellow-500 mb-4" />
                  </motion.div>
                  <p className="text-white font-bold">Procesando transacción...</p>
                </div>
              )}

              {/* --- ÉXITO --- */}
              {step === "success" && (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-green-500 text-black p-4 rounded-full mb-4">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">¡Pago Exitoso!</h3>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}