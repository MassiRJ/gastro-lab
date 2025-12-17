"use client";

import { useState, useEffect } from "react";
import { DollarSign, Search, Calculator, Printer, FileText } from "lucide-react";
import jsPDF from "jspdf";

export default function Cashier() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Carga automática de pedidos
  useEffect(() => {
    const fetchOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("kitchen_orders") || "[]");
      setOrders(savedOrders);
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // --- FUNCIÓN GENERAR TICKET PDF ---
  const printTicket = (order) => {
    const total = order.total;
    const baseImponible = total / 1.18;
    const igv = total - baseImponible;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 280]
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("GASTRO LAB S.A.C.", 40, 10, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("RUC: 20601234567", 40, 15, { align: "center" });
    doc.text("Av. La Marina 123, Lima", 40, 19, { align: "center" });
    doc.text("BOLETA DE VENTA ELECTRÓNICA", 40, 25, { align: "center" });
    doc.text(`B001-${order.id.toString().slice(-6)}`, 40, 29, { align: "center" });
    doc.text("---------------------------------------------", 40, 33, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.text(`CLIENTE: VARIOS`, 5, 38);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 5, 43);
    doc.text(`Moneda: SOLES`, 5, 47);
    doc.text("---------------------------------------------", 40, 52, { align: "center" });

    let y = 57; 
    doc.setFontSize(7);
    doc.text("CANT", 5, y);
    doc.text("DESCRIPCIÓN", 15, y);
    doc.text("TOTAL", 75, y, { align: "right" });
    y += 4;

    order.items.forEach((item) => {
      const title = item.title.length > 22 ? item.title.substring(0, 22) + "..." : item.title;
      doc.text("1.00", 5, y);
      doc.text(title, 15, y);
      doc.text(item.price.replace("S/ ", ""), 75, y, { align: "right" });
      y += 5;
    });

    doc.text("---------------------------------------------", 40, y, { align: "center" });
    y += 5;

    doc.setFontSize(8);
    doc.text("OP. GRAVADA:", 45, y);
    doc.text(baseImponible.toFixed(2), 75, y, { align: "right" });
    y += 4;
    
    doc.text("I.G.V. (18%):", 45, y);
    doc.text(igv.toFixed(2), 75, y, { align: "right" });
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTE TOTAL:", 5, y);
    doc.text(`S/ ${total.toFixed(2)}`, 75, y, { align: "right" });
    y += 5;

    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text("PRECIOS INCLUYEN IGV", 75, y, { align: "right" });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.text(`CONDICIÓN PAGO: CONTADO`, 5, y);
    y += 4;
    doc.text(`MÉTODO: ${order.paymentMethod || 'EFECTIVO'}`, 5, y);
    y += 10;

    doc.text("Representación Impresa de la Boleta Electrónica", 40, y, { align: "center" });
    doc.text("Consulte en www.gastrolab.com", 40, y + 4, { align: "center" });

    doc.save(`boleta-${order.id}.pdf`);
  };

  const markAsPaid = (id) => {
    if (!confirm("¿Confirmar cobro y emitir boleta?")) return;

    const currentOrder = orders.find(o => o.id === id);
    const updatedOrders = orders.map(order => {
      if (order.id === id) {
        return { ...order, paymentStatus: "PAGADO", paymentMethod: "EFECTIVO (CAJA)" };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem("kitchen_orders", JSON.stringify(updatedOrders));
    printTicket(currentOrder); 
  };

  const filteredOrders = orders.filter(order => 
    order.table.toString().includes(searchTerm) || 
    order.id.toString().includes(searchTerm)
  );

  const totalSales = orders
    .filter(o => o.paymentStatus === "PAGADO")
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-zinc-800 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-2">
            <Calculator className="text-blue-600" /> Control de Caja
          </h1>
          <p className="text-gray-500 text-sm">Administración de pagos y cobros</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase">Ventas del Día</p>
            <p className="text-2xl font-bold text-zinc-900">S/ {totalSales.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar por número de mesa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div 
            key={order.id} 
            className={`bg-white rounded-xl shadow-lg border-l-8 overflow-hidden transition-all ${
              order.paymentStatus === "PENDIENTE" 
                ? "border-l-orange-500 ring-2 ring-orange-500/20"
                : "border-l-green-500 opacity-75 grayscale-[0.5]"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {order.type === "mesa" ? `Mesa ${order.table}` : "Delivery"}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">#{order.id}</p>
                </div>
                
                {order.paymentStatus === "PENDIENTE" ? (
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-200 animate-pulse">
                    POR COBRAR
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    PAGADO
                  </span>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-2 text-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600 border-b border-gray-200 pb-1 last:border-0">
                    <span>1x {item.title}</span>
                    <span className="font-medium text-gray-900">{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-300 mt-2 text-base font-bold text-zinc-900">
                  <span>Total a Cobrar:</span>
                  <span>S/ {order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.paymentStatus === "PENDIENTE" ? (
                <button 
                  onClick={() => markAsPaid(order.id)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <Printer size={20} />
                  EMITIR BOLETA
                </button>
              ) : (
                <button 
                  onClick={() => printTicket(order)} 
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg flex items-center justify-center gap-2 border border-gray-300 transition-colors"
                >
                  <FileText size={16} />
                  Reimprimir Boleta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}