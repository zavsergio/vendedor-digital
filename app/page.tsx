'use client';

import { useState } from 'react';

// Datos de ejemplo (luego los conectaremos con Supabase)
const categorias = ["Todos", "Burguers", "Bebidas", "Postres"];

const productos = [
  { id: 1, nombre: "Burger Clásica Doble", precio: 8500, categoria: "Burguers", descripcion: "Doble carne, cheddar, lechuga, tomate y salsa especial.", imagen: "🍔" },
  { id: 2, nombre: "Burger Bacon & Cheddar", precio: 9800, categoria: "Burguers", descripcion: "Medallón vacuno, mucho cheddar, panceta crujiente y BBQ.", imagen: "🥓" },
  { id: 3, nombre: "Cerveza Artesanal 500ml", precio: 3500, categoria: "Bebidas", descripcion: "IPA / Honey / Amber Ale tirada.", imagen: "🍺" },
  { id: 4, nombre: "Gaseosa Línea Pepsi 500ml", precio: 2200, categoria: "Bebidas", descripcion: "Fría en botella de vidrio o lata.", imagen: "🥤" },
  { id: 5, nombre: "Helado Artesanal de Chocolate", precio: 4000, categoria: "Postres", descripcion: "Doble bocha de chocolate intenso con almendras.", imagen: "🍨" },
];

export default function CatalogoDigital() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [carrito, setCarrito] = useState<{ [key: number]: number }>({} );

  // Filtrar productos según la categoría
  const productosFiltrados = categoriaSeleccionada === "Todos" 
    ? productos 
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  const agregarAlCarrito = (id: number) => {
    setCarrito(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const totalItems = Object.values(carrito).reduce((a, b) => a + b, 0);
  const montoTotal = Object.entries(carrito).reduce((total, [id, cantidad]) => {
    const prod = productos.find(p => p.id === Number(id));
    return total + (prod ? prod.precio * cantidad : 0);
  }, 0);

  const enviarPedidoWhatsApp = () => {
    let mensaje = "¡Hola! Quiero hacer el siguiente pedido:\n\n";
    Object.entries(carrito).forEach(([id, cantidad]) => {
      const prod = productos.find(p => p.id === Number(id));
      if (prod) {
        mensaje += `- ${cantidad}x ${prod.nombre} ($${prod.precio * cantidad})\n`;
      }
    });
    mensaje += `\n*Total a abonar: $${montoTotal}*`;
    
    // Número de WhatsApp del comercio (ejemplo genérico o dinámico)
    const telefonoComercio = "549343000000"; 
    const url = `https://wa.me/${telefonoComercio}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 pb-24">
      {/* Encabezado del Local */}
      <header className="bg-slate-900 text-white p-6 text-center shadow-md">
        <h1 className="text-2xl font-bold">🍔 El Bodegón Digital</h1>
        <p className="text-sm text-gray-300 mt-1">Catálogo Interactivo de Productos</p>
      </header>

      {/* Selector de Categorías */}
      <div className="flex overflow-x-auto p-4 gap-2 bg-white shadow-sm sticky top-0 z-10">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoriaSeleccionada === cat 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listado de Productos */}
      <div className="max-w-md mx-auto p-4 grid gap-4">
        {productosFiltrados.map(prod => (
          <div key={prod.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="text-4xl p-2 bg-gray-50 rounded-lg">{prod.imagen}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{prod.nombre}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{prod.descripcion}</p>
              <p className="font-bold text-blue-600 mt-2">${prod.precio.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => agregarAlCarrito(prod.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow transition-transform active:scale-95"
            >
              ➕
            </button>
          </div>
        ))}
      </div>

      {/* Barra flotante inferior para enviar pedido */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-between items-center max-w-md mx-auto rounded-t-2xl">
          <div>
            <p className="text-xs text-gray-500">{totalItems} productos seleccionados</p>
            <p className="text-lg font-bold text-slate-900">${montoTotal.toLocaleString()}</p>
          </div>
          <button 
            onClick={enviarPedidoWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            📲 Enviar Pedido
          </button>
        </div>
      )}
    </main>
  );
}