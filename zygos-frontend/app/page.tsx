export const dynamic = 'force-dynamic';

import Image from 'next/image'
import { client } from '../lib/sanity'
import AnimatedHeroBackground from "@/components/AnimatedHeroBackground";

// 1. Interfaz actualizada: agregamos 'estado'
interface Producto {
  _id: string;
  nombre: string;
  precio: number;
  drop: string;
  estado: string; // <-- NECESARIO PARA SABER SI ESTÁ DISPONIBLE O AGOTADO
  galeria: string[];
  tallas: string[];
}

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // En Next.js 15, searchParams es una promesa que debe resolverse
  const resolvedParams = await searchParams;
  const tallaSeleccionada = typeof resolvedParams?.talla === 'string' ? resolvedParams.talla : undefined;

  // Consulta GROQ dinámica
  const query = tallaSeleccionada
    ? `*[_type == "producto" && "${tallaSeleccionada}" in tallas]{
        _id, nombre, precio, drop, "galeria": galeria[].asset->url, tallas, estado
      }`
    : `*[_type == "producto"]{
        _id, nombre, precio, drop, "galeria": galeria[].asset->url, tallas, estado
      }`;
  
  const productos: Producto[] = await client.fetch(query);
  const numeroWhatsApp = "50663512613";

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* HEADER TÁCTICO */}
      <header className="fixed top-0 w-full z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="relative w-10 h-10">
              <Image 
                src="/zygos_black.png" 
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
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-between py-12 border-b border-neutral-900 bg-black text-white px-4 overflow-x-hidden">
        
        {/* NUEVO FONDO ANIMADO */}
        <AnimatedHeroBackground />

        {/* Espacio superior para balance */}
        <div />

        {/* Contenido Central */}
        <div className="z-10 flex flex-col items-center text-center max-w-full px-2">
          <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 mb-6 uppercase border border-neutral-900 px-3 py-1">
            // Origin: Upala, CR //
          </span>
          
          {/* Tamaños unificados: 5xl en móvil, escalando juntos hasta 9xl en escritorio */}
          <h1 className="text-[2.6rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] font-black tracking-tighter uppercase leading-[0.85] mb-6 w-full break-words">
            Unión<br /> 
            Streetwear
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm md:text-base font-medium max-w-sm leading-relaxed px-2">
            El balance entre lo clásico y lo urbano. 
            Cada pieza conecta culturas, estilos y personas.
          </p>
        </div>

        {/* Información de envío */}
        <div className="z-10 flex items-center justify-center text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-neutral-600 border-t border-neutral-900 pt-6 w-full max-w-lg px-4">
          <span>// Envío nacional a todo Costa Rica</span>
        </div>
      </section>

      {/* SECCIÓN DEL CATÁLOGO */}
      <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Cabecera del catálogo */}
        <div className="flex items-center justify-between mb-8 border-b border-neutral-900 pb-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">
            Latest Drops
          </h2>
          <span className="text-sm font-bold text-neutral-500 tracking-widest">
            [{productos.length} ÍTEMS]
          </span>
        </div>

        {/* FILTRO DE TALLAS */}
        <div className="flex gap-2 mb-12 overflow-x-auto no-scrollbar">
          <a 
            href="/#catalogo" 
            className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${!tallaSeleccionada ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-500 border-neutral-800 hover:text-white hover:border-neutral-500'}`}
          >
            Todas
          </a>
          {["S", "M", "L", "XL"].map((talla) => (
            <a 
              key={talla}
              href={`/?talla=${talla}#catalogo`}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${tallaSeleccionada === talla ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-500 border-neutral-800 hover:text-white hover:border-neutral-500'}`}
            >
              {talla}
            </a>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {productos.map((producto) => {
            const mensajeWa = encodeURIComponent(`Hola, me interesa comprar: ${producto.nombre}`);
            const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWa}`;
            
            // Verificador de stock
            const isAgotado = producto.estado === "agotado";

            return (
              <div key={producto._id} className={`group relative flex flex-col ${isAgotado ? 'opacity-80' : ''}`}>
                
                {/* Contenedor del Carrusel */}
                <div className="relative aspect-[4/5] w-full bg-neutral-900 mb-6 overflow-hidden">
                  
                  {/* OVERLAY AGOTADO (Sello urbano rojo) */}
                  {isAgotado && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-red-600 text-red-600 px-6 py-2 text-xl md:text-2xl font-black tracking-[0.4em] uppercase -rotate-12 bg-black/60 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        Sold Out
                      </div>
                    </div>
                  )}

                  <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full w-full">
                    {producto.galeria && producto.galeria.length > 0 ? (
                      producto.galeria.map((imgUrl, index) => (
                        <div key={index} className="shrink-0 w-full h-full relative snap-center">
                          <Image 
                            src={imgUrl} 
                            alt={`${producto.nombre} - Vista ${index + 1}`}
                            fill
                            // Si está agotado, se queda en gris perpetuo. Si no, aplica el efecto hover normal.
                            className={`object-cover object-center transition-all duration-500 ${isAgotado ? 'grayscale' : 'md:grayscale group-hover:grayscale-0'}`}
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
                    <div className="absolute top-4 left-4 bg-black text-white border border-white text-xs font-bold px-3 py-1 uppercase tracking-widest z-30">
                      {producto.drop}
                    </div>
                  )}
                  
                  {/* Etiqueta de Stock Dinámica */}
                  <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 uppercase tracking-widest z-30 ${isAgotado ? 'bg-red-600 text-white' : 'bg-white text-black'}`}>
                    {isAgotado ? 'Sold Out' : 'In Stock'}
                  </div>

                  {/* Indicador minimalista de Swipe (Solo móvil) */}
                  {producto.galeria && producto.galeria.length > 1 && !isAgotado && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-[0.2em] uppercase px-3 py-1.5 border border-white/20 z-10 pointer-events-none md:hidden">
                      <span>Desliza</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Detalles de la Prenda */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-lg font-black tracking-tight uppercase max-w-[70%] ${isAgotado ? 'text-neutral-500 line-through decoration-red-600/50' : 'text-white'}`}>
                      {producto.nombre}
                    </h3>
                    <p className={`text-lg font-medium tracking-tighter ${isAgotado ? 'text-neutral-500' : 'text-white'}`}>
                      ₡{producto.precio}
                    </p>
                  </div>
                  
                  {producto.tallas && (
                    <div className="flex gap-2 mb-6">
                      {producto.tallas.map(talla => (
                        <span key={talla} className={`text-xs font-bold px-2 py-1 border ${tallaSeleccionada === talla ? 'bg-white text-black border-white' : isAgotado ? 'border-neutral-900 text-neutral-700' : 'border-neutral-800 text-neutral-400'}`}>
                          {talla}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Botón de Acción Dinámico */}
                  {isAgotado ? (
                    <button 
                      disabled
                      className="mt-auto w-full border border-neutral-800 bg-neutral-900 text-neutral-600 font-bold text-sm tracking-widest uppercase py-4 text-center cursor-not-allowed"
                    >
                      Agotado
                    </button>
                  ) : (
                    <a 
                      href={linkWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-full border border-white bg-transparent text-white hover:bg-white hover:text-black font-bold text-sm tracking-widest uppercase py-4 text-center transition-colors"
                    >
                      Comprar vía WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
      
      {/* FOOTER TÁCTICO */}
      <footer className="border-t border-neutral-900 bg-black pt-16 pb-12 px-6 flex flex-col items-center">
        
        {/* Enlaces de Redes - Estilo Manifiesto */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16 w-full max-w-2xl border-b border-neutral-900 pb-12">

          <a href="https://www.instagram.com/zygosstorecr?igsh=MTdneDl1dXFiNjJkMw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-white uppercase transition-colors">
            <span className="w-1.5 h-1.5 bg-neutral-800 group-hover:bg-white transition-colors"></span>
            Instagram
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-white uppercase transition-colors">
            <span className="w-1.5 h-1.5 bg-neutral-800 group-hover:bg-white transition-colors"></span>
            TikTok
          </a>
          <a href="https://www.facebook.com/profile.php?id=61581896079125" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-white uppercase transition-colors">
            <span className="w-1.5 h-1.5 bg-neutral-800 group-hover:bg-white transition-colors"></span>
            Facebook
          </a>
          
          <a href={`https://wa.me/${numeroWhatsApp}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-neutral-500 hover:text-white uppercase transition-colors">
            <span className="w-1.5 h-1.5 bg-neutral-800 group-hover:bg-white transition-colors"></span>
            WhatsApp
          </a>
        </div>

        {/* Logo interactivo y Copyright */}
        <div className="relative w-12 h-12 mb-8 opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-pointer">
          <Image src="/zygos_black.png" alt="Zygos Logo" fill className="object-contain" sizes="48px" />
        </div>
        
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-[10px] font-mono tracking-[0.4em] text-neutral-500 uppercase border border-neutral-900 px-3 py-1">
            Origin: Upala, CR
          </span>
          <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-700 uppercase mt-4">
            © 2026 Zygos Store. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}