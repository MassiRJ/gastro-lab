"use client";

import { X, Trash2, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient"; // Asegúrate que esta ruta esté bien

export default function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableNumber, setTableNumber] = useState(""); // Para saber a qué mesa llevar la comida

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!tableNumber) {
      alert("Por favor ingresa el número de mesa.");
      return;
    }

    setIsProcessing(true);

    const newOrder = {
      table_number: tableNumber,
      customer_name: "Cliente App", // Podrías pedir el nombre también si quieres
      items: cartItems, // Guardamos todos los platos
      total_price: total,
      status: 'pendiente',
      payment_method: 'tarjeta' // O lo que elijas
    };

    const { error } = await supabase
      .from('orders') // <--- OJO: Estamos guardando en 'orders', NO en 'reservations'
      .insert([newOrder]);

    if (error) {
      alert("Error al pedir: " + error.message);
      setIsProcessing(false);
    } else {
      alert("¡Pedido enviado a cocina! 👨‍🍳");
      // Limpiar carrito (si tienes una función para eso, si no, recarga)
      if (onClearCart) onClearCart(); 
      else window.location.reload(); // Recarga simple para limpiar
      onClose();
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-zinc-900 border-l border-zinc-800 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-yellow-500" /> Tu Pedido
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg">
                <div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-yellow-500 text-sm">S/ {item.price}</p>
                </div>
                <button onClick={() => onRemoveItem(index)} className="text-red-400 hover:text-red-300">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Zona de Pago */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-700 pt-6 space-y-4">
            
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Número de Mesa</label>
              <select 
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-black text-white p-3 rounded-lg border border-zinc-700 focus:border-yellow-500 outline-none"
              >
                <option value="">Selecciona tu mesa...</option>
                <option value="Mesa 1">Mesa 1</option>
                <option value="Mesa 2">Mesa 2</option>
                <option value="Mesa 3">Mesa 3</option>
                <option value="Mesa 4">Mesa 4</option>
                <option value="Barra">Barra</option>
              </select>
            </div>

            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total:</span>
              <span className="text-yellow-500">S/ {total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2"
            >
              {isProcessing ? "Enviando..." : "Confirmar Pedido"} <CreditCard size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}