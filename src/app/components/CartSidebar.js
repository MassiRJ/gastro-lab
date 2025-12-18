"use client";

import { X, Trash2, CreditCard, ShoppingBag, Banknote, QrCode } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableNumber, setTableNumber] = useState(""); 
  const [paymentMethod, setPaymentMethod] = useState("efectivo"); // 'efectivo' | 'yape'

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!tableNumber) {
      alert("⚠️ Por favor selecciona tu número de mesa antes de pedir.");
      return;
    }

    setIsProcessing(true);

    const newOrder = {
      table_number: tableNumber,
      customer_name: "Cliente App",
      items: cartItems,
      total_price: total,
      status: 'pendiente',
      payment_method: paymentMethod // Aquí guardamos lo que eligió el cliente
    };

    const { error } = await supabase
      .from('orders')
      .insert([newOrder]);

    if (error) {
      alert("Error: " + error.message);
      setIsProcessing(false);
    } else {
      alert(`¡Pedido Enviado! 👨‍🍳\n\nMétodo de pago: ${paymentMethod.toUpperCase()}\nUn mesero se acercará a confirmar.`);
      if (onClearCart) onClearCart(); 
      else window.location.reload(); 
      onClose();
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-zinc-950 border-l border-zinc-800 transform transition-transform duration-300 z-50 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" /> Tu Pedido
          </h2>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* LISTA DE ITEMS (SCROLL) */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
              <ShoppingBag size={48} className="mb-2" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-yellow-500 text-sm font-bold">S/ {item.price}</p>
                </div>
                <button 
                  onClick={() => onRemoveItem(index)} 
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ZONA DE PAGO (FIJA ABAJO) */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-800 pt-6 space-y-5 bg-zinc-950">
            
            {/* 1. SELECCIÓN DE MESA */}
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold mb-2 block ml-1">¿Dónde estás sentado?</label>
              <select 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-zinc-900 text-white p-4 rounded-xl border border-zinc-700 focus:border-yellow-500 outline-none appearance-none"
              >
                <option value="">Selecciona tu mesa...</option>
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={`Mesa ${n}`}>Mesa {n}</option>
                ))}
                <option value="Barra">Barra</option>
              </select>
            </div>

            {/* 2. MÉTODO DE PAGO */}
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold mb-2 block ml-1">Método de Pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'efectivo' ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                >
                  <Banknote size={24} />
                  <span className="text-sm font-bold">Efectivo / Caja</span>
                </button>

                <button 
                  onClick={() => setPaymentMethod('yape')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'yape' ? 'bg-purple-600 border-purple-600 text-white' : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                >
                  <QrCode size={24} />
                  <span className="text-sm font-bold">Yape / Plin</span>
                </button>
              </div>
            </div>

            {/* 3. TOTAL Y BOTÓN FINAL */}
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400">Total a Pagar</span>
                <span className="text-3xl font-bold text-white">S/ {total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 text-lg shadow-lg"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Enviando pedido...</span>
                ) : (
                  <>Confirmar Pedido <CreditCard size={20} /></>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}