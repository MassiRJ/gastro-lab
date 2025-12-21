"use client";

import { X, Trash2, CreditCard, ShoppingBag, Banknote, QrCode, CheckCircle, MapPin, Receipt } from "lucide-react";
import { useState, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [tableNumber, setTableNumber] = useState(""); 
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  
  // ESTADO NUEVO: Para "recordar" el total cuando borremos el carrito
  const [lastOrderTotal, setLastOrderTotal] = useState(0);

  // --- CÁLCULO DEL TOTAL EN VIVO ---
  const currentTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      let priceString = String(item.price);
      let cleanPrice = priceString.replace(/[^0-9.]/g, '');
      const numberPrice = parseFloat(cleanPrice) || 0;
      return sum + numberPrice;
    }, 0);
  }, [cartItems]);
  // --------------------------------

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!tableNumber) {
      alert("⚠️ Por favor selecciona tu número de mesa.");
      return;
    }

    setIsProcessing(true);

    // 1. Guardamos el total en una variable fija ANTES de borrar nada
    const totalToSave = currentTotal;
    setLastOrderTotal(totalToSave); 

    const newOrder = {
      table_number: tableNumber,
      customer_name: "Cliente Mesa",
      items: cartItems,
      total_price: totalToSave, // Usamos la variable fija
      status: 'pendiente',
      payment_method: paymentMethod
    };

    const { error } = await supabase.from('orders').insert([newOrder]);

    if (error) {
      alert("Error: " + error.message);
      setIsProcessing(false);
    } else {
      setOrderSuccess(true);
      setIsProcessing(false);
      
      // Aquí borramos el carrito, PERO ya tenemos el 'lastOrderTotal' guardado
      if (onClearCart) onClearCart(); 
    }
  };

  const closeSidebarTotal = () => {
    setOrderSuccess(false);
    setTableNumber("");
    setLastOrderTotal(0); // Reiniciamos para la próxima
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-zinc-950 border-l border-zinc-800 transform transition-transform duration-300 z-50 shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* VISTA DE TICKET (EXITO) */}
      {orderSuccess ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-bounce">
            <CheckCircle size={48} />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">¡Pedido Enviado!</h2>
          <p className="text-gray-400 mb-8">La cocina ya está preparando tus platos.</p>

          <div className="bg-zinc-900 w-full p-6 rounded-2xl border border-zinc-800 space-y-4 mb-8 text-left">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <span className="text-gray-400 flex items-center gap-2"><MapPin size={16}/> Mesa</span>
              <span className="text-white font-bold text-xl">{tableNumber}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <span className="text-gray-400 flex items-center gap-2"><Receipt size={16}/> Total</span>
              {/* AQUÍ ESTÁ EL ARREGLO: Usamos lastOrderTotal en vez de currentTotal */}
              <span className="text-yellow-500 font-bold text-2xl">S/ {lastOrderTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pago</span>
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
        /* VISTA DE CARRITO */
        <>
          <div className="p-6 flex-none border-b border-zinc-800">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-yellow-500" /> Tu Pedido
              </h2>
              <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
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
                    <p className="text-yellow-500 text-sm font-bold">
                        {typeof item.price === 'number' ? `S/ ${item.price.toFixed(2)}` : item.price}
                    </p>
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

          {/* FOOTER FIJO */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-zinc-950 border-t border-zinc-800 space-y-5 flex-none z-10">
              
              {/* Selector Mesa */}
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

              {/* Selector Pago */}
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
                  <span className="text-sm font-bold">Yape</span>
                </button>
              </div>

              {/* TOTAL Y PAGAR */}
              <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 mt-2">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-gray-400 font-medium">Total a Pagar</span>
                  <span className="text-4xl font-extrabold text-white tracking-tight">S/ {currentTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex justify-center items-center gap-2 text-lg shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? "Enviando..." : "Confirmar Pedido"} <CreditCard size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}