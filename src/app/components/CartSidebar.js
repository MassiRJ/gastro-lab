"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight, MapPin, Utensils } from "lucide-react";
import PaymentModal from "./PaymentModal"; 

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem }) {
  const [orderType, setOrderType] = useState("mesa");
  const [tableNumber, setTableNumber] = useState("");
  const [showPayment, setShowPayment] = useState(false); 

  // --- NUEVO: DETECTAR MESA AUTOMÁTICAMENTE ---
  useEffect(() => {
    // Esto se ejecuta apenas carga la página
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const mesaUrl = params.get("mesa"); // Busca "?mesa=X"
      
      if (mesaUrl) {
        setTableNumber(mesaUrl); // Rellena el input solo
        setOrderType("mesa"); // Fuerza la opción "En Mesa"
      }
    }
  }, []);
  // ---------------------------------------------

  const total = cartItems.reduce((acc, item) => {
    const priceNumber = parseFloat(item.price.replace("S/ ", ""));
    return acc + priceNumber;
  }, 0);

  const handlePaymentSuccess = (paymentDetails) => {
    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total: total,
      type: orderType,
      table: tableNumber || "N/A",
      status: "pendiente",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentStatus: paymentDetails.status,
      paymentMethod: paymentDetails.method
    };

    const existingOrders = JSON.parse(localStorage.getItem("kitchen_orders") || "[]");
    existingOrders.push(newOrder);
    localStorage.setItem("kitchen_orders", JSON.stringify(existingOrders));

    setShowPayment(false);
    window.location.reload(); 
  };

  return (
    <>
      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-900 border-l border-zinc-800 z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Tu Pedido</h2>
                <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 px-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderType("mesa")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    orderType === "mesa"
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                      : "bg-zinc-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <Utensils size={18} />
                  En Mesa
                </button>
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                    orderType === "delivery"
                      ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                      : "bg-zinc-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <MapPin size={18} />
                  Delivery
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                    <p>Tu carrito está vacío.</p>
                    <button onClick={onClose} className="text-yellow-500 font-medium hover:underline">
                      Ver el menú
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`${item.id}-${index}`}
                      className="flex gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800"
                    >
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.title}</h3>
                        <p className="text-yellow-500 font-bold mt-1">{item.price}</p>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(index)}
                        className="text-gray-500 hover:text-red-500 transition-colors self-center p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 bg-zinc-950 border-t border-zinc-800 space-y-4">
                  
                  {orderType === "mesa" && (
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
                      <label className="block text-sm text-gray-400 mb-2">Número de Mesa</label>
                      <input 
                        type="number" 
                        placeholder="Ej: 5"
                        // CAMBIO: Si la mesa vino de la URL, deshabilitamos el input para que no lo cambien (opcional)
                        readOnly={!!new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('mesa')}
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className={`w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-yellow-500 outline-none transition-colors ${
                          tableNumber ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white font-bold">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-yellow-500">Total:</span>
                    <span className="text-white">S/ {total.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (orderType === "mesa" && !tableNumber) {
                        alert("⚠️ Por favor ingresa tu número de mesa");
                        return;
                      }
                      setShowPayment(true);
                    }}
                    className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2"
                  >
                    {orderType === "mesa" ? "Confirmar Pedido" : "Finalizar Compra"} 
                    <ArrowRight size={20} />
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Podrás elegir método de pago en el siguiente paso.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}