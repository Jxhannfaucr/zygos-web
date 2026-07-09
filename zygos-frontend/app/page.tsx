export const dynamic = 'force-dynamic';

import Image from 'next/image'
import { client } from '../lib/sanity'

// 1. Interfaz actualizada con el arreglo de galería y el drop
interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  drop: string;
  galeria: string[];
  tallas: string[];
}

export default async function Catalogo() {
  // 2. Consulta GROQ corregida para extraer la galería y el drop
  const query = `*[_type == "producto" && estado == "disponible"]{
    _id,
    nombre,
    precio,
    drop,
    "galeria": galeria[].asset->url,
    tallas
  }`
  
  const productos: Producto[] = await client.fetch(query)
  const numeroWhatsApp = "50688888888" 

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* HEADER TÁCTICO */}
      <header className="fixed top-0 w-full z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-10 h-10">
              <Image 
                src="/zygos-logo.png" 
                alt="Zygos Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase mt-1">
              Zygos
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] text-neutral-400">
            <a href="#catalogo" className="hover:text-white transition-colors">LATEST DROPS</a>
            <a href="#catalogo" className="hover:text-white transition-colors">SHOP</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION IMMERSIVO */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16">
          <span className="text-xs font-bold tracking-[0.3em] text-neutral-400 mb-6 uppercase">
            // Nueva Temporada //
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
            Defy<br />The Norm
          </h1>
          <a 
            href="#catalogo" 
            className="bg-white text-black px-10 py-4 text-sm font-bold tracking-[0.1em] uppercase hover:bg-neutral-200 hover:scale-105 transition-all duration-300"
          >
            Explorar Colección
          </a>
        </div>
      </section>

      {/* SECCIÓN DEL CATÁLOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-16 border-b border-neutral-900 pb-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">
            Latest Drops
          </h2>
          <span className="text-sm font-bold text-neutral-500 tracking-widest">
            [{productos.length} ÍTEMS]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {productos.map((producto) => {
            const mensajeWa = encodeURIComponent(`Hola, me interesa comprar: ${producto.nombre}`);
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWa}`;

            return (
              <div key={producto._id} className="group relative flex flex-col">
                
                {/* 3. Contenedor del Carrusel con CSS Scroll Snap y tu diseño */}
                <div className="relative aspect-[4/5] w-full bg-neutral-900 mb-6 overflow-hidden">
                  <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full">
                    {producto.galeria && producto.galeria.length > 0 ? (
                      producto.galeria.map((imgUrl, index) => (
                        <div key={index} className="shrink-0 w-full h-full relative snap-center">
                          <Image 
                            src={imgUrl} 
                            alt={`${producto.nombre} - Vista ${index + 1}`}
                            fill
                            className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index === 0}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600 font-bold tracking-widest text-sm">NO IMAGE</div>
                    )}
                  </div>

                  {/* Etiquetas Superpuestas */}
                  {producto.drop && (
                    <div className="absolute top-4 left-4 bg-black text-white border border-white text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">
                      {producto.drop}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10">
                    In Stock
                  </div>
                </div>
                
                {/* Detalles de la Prenda */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black tracking-tight uppercase max-w-[70%]">
                      {producto.nombre}
                    </h3>
                    <p className="text-lg font-medium tracking-tighter">
                      ₡{producto.precio}
                    </p>
                  </div>
                  
                  {producto.tallas && (
                    <div className="flex gap-2 mb-6">
                      {producto.tallas.map(talla => (
                        <span key={talla} className="text-xs font-bold px-2 py-1 border border-neutral-800 text-neutral-400">
                          {talla}
                        </span>
                      ))}
                    </div>
                  )}

                  <a 
                    href={linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full border border-white bg-transparent text-white hover:bg-white hover:text-black font-bold text-sm tracking-widest uppercase py-4 text-center transition-colors"
                  >
                    Comprar vía WhatsApp
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* FOOTER BÁSICO */}
      <footer className="border-t border-neutral-900 py-12 text-center flex flex-col items-center">
         <div className="relative w-12 h-12 mb-6 opacity-50">
            <Image src="/zygos-logo.png" alt="Zygos Logo" fill className="object-contain" />
         </div>
         <p className="text-xs font-bold tracking-widest text-neutral-600 uppercase">
           © 2026 Zygos Store. Todos los derechos reservados.
         </p>
      </footer>
    </main>
  )
}