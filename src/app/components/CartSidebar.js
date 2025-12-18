"use client";

import { X, Trash2, CreditCard, ShoppingBag, Banknote, QrCode, CheckCircle, MapPin, Receipt } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // Nuevo estado para pantalla de éxito
  const [tableNumber, setTableNumber] = useState(""); 
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  // Calcular total asegurando que sean números
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price;
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!tableNumber) {
      alert("⚠️ Por favor selecciona tu número de mesa."); // Esta alerta sí es útil para validación
      return;
    }

    setIsProcessing(true);

    const newOrder = {
      table_number: tableNumber,
      customer_name: "Cliente Mesa",
      items: cartItems,
      total_price: total,
      status: 'pendiente',
      payment_method: paymentMethod
    };

    const { error } = await supabase.from('orders').insert([newOrder]);

    if (error) {
      alert("Error: " + error.message);
      setIsProcessing(false);
    } else {
      // EN LUGAR DE ALERT, CAMBIAMOS EL ESTADO A "EXITO"
      setOrderSuccess(true);
      setIsProcessing(false);
      
      // Limpiamos el carrito en la "memoria" del padre, pero no cerramos el sidebar aún
      if (onClearCart) onClearCart(); 
    }
  };

  const closeSidebarTotal = () => {
    setOrderSuccess(false);
    setTableNumber("");
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-zinc-950 border-l border-zinc-800 transform transition-transform duration-300 z-50 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* --- VISTA DE ÉXITO (TICKET) --- */}
      {orderSuccess ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-bounce">
            <CheckCircle size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">¡Pedido Enviado!</h2>
          <p className="text-gray-400 mb-8">La cocina ya está preparando tus platos.</p>

          <div className="bg-zinc-900 w-full p-6 rounded-2xl border border-zinc-800 space-y-4 mb-8">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <span className="text-gray-400 flex items-center gap-2"><MapPin size={16}/> Mesa</span>
              <span className="text-white font-bold text-xl">{tableNumber}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <span className="text-gray-400 flex items-center gap-2"><Receipt size={16}/> Total</span>
              <span className="text-yellow-500 font-bold text-2xl">S/ {total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Método de Pago</span>
              <span className="text-white font-bold uppercase bg-zinc-800 px-3 py-1 rounded text-sm border border-zinc-700">
                {paymentMethod === 'yape' ? '📱 Yape/Plin' : '💵 Efectivo'}
              </span>
            </div>
          </div>

          <button 
            onClick={closeSidebarTotal}
            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Entendido, gracias
          </button>
        </div>
      ) : (
        /* --- VISTA NORMAL DEL CARRITO --- */
        <div className="p-6 h-full flex flex-col">
          {/* Encabezado */}
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="text-yellow-500" /> Tu Pedido
            </h2>
            <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                <ShoppingBag size={48} className="mb-2" />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
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

          {/* Zona de Pago */}
          {cartItems.length > 0 && (
            <div className="border-t border-zinc-800 pt-6 space-y-5 bg-zinc-950">
              
              {/* Selección de Mesa */}
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold mb-2 block ml-1">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <select 
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-zinc-900 text-white p-4 pl-12 rounded-xl border border-zinc-700 focus:border-yellow-500 outline-none appearance-none font-medium cursor-pointer"
                  >
                    <option value="">Selecciona tu mesa...</option>
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={`Mesa ${n}`}>Mesa {n}</option>
                    ))}
                    <option value="Barra">Barra</option>
                  </select>
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold mb-2 block ml-1">Método de Pago</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'efectivo' ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    <Banknote size={24} />
                    <span className="text-sm font-bold">Efectivo</span>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('yape')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'yape' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:border-gray-500'}`}
                  >
                    <QrCode size={24} />
                    <span className="text-sm font-bold">Yape/Plin</span>
                  </button>
                </div>
              </div>

              {/* Total y Confirmar */}
              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 mt-2">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-400 font-medium">Total a Pagar</span>
                  <span className="text-3xl font-bold text-white tracking-tight">S/ {total.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 text-lg shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span> Enviando...</span>
                  ) : (
                    <>Confirmar Pedido <CreditCard size={20} /></>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}