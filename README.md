# ⚡ ZYGOS STORE // UNIÓN STREETWEAR

> **El balance entre lo clásico y lo urbano. Cada pieza conecta culturas, estilos y personas.**

Frontend oficial de **Zygos Store**, un e-commerce de mi tienda streetwear con base en Upala, Costa Rica. Construido bajo una estética brutalista, minimalista y técnica. La arquitectura está orientada al rendimiento extremo mediante Server Components, eliminando el peso en el cliente y operando con un gestor de contenido (CMS) headless para control de inventario en tiempo real.

---

## 🛠 STACK TÉCNICO Y HERRAMIENTAS

* **Core Framework:** Next.js 15 (App Router)
* **Lenguaje:** TypeScript (Tipado estricto para alta escalabilidad)
* **Estilos & UI:** Tailwind CSS (Diseño utility-first y responsive design)
* **Backend / Base de Datos:** Sanity CMS (Gestión de drops y consultas mediante GROQ)
* **Gráficos & Renderizado:** HTML5 Canvas API (Matemáticas procedimentales puras, cero dependencias)
* **Infraestructura:** Vercel (Despliegue serverless continuo)

---

## ⚙️ ARQUITECTURA Y CARACTERÍSTICAS CLAVE

* **Performance Server-First:** Carga inicial instantánea. El motor del catálogo opera 100% desde el servidor (`force-dynamic`), procesando la data de Sanity sin saturar el dispositivo del usuario con JavaScript innecesario.
* **Filtros URL-Based (Zero-State):** Filtrado de tallas inyectado directamente en los parámetros de la URL y resuelto del lado del servidor. Permite a los usuarios compartir enlaces exactos con el inventario filtrado.
* **Hero Animado Procedural:** Malla topográfica generada matemáticamente que fluye como tela, optimizada con inyección de datos de marcas (Supreme, Bape, Stüssy) en colores neón y control de `prefers-reduced-motion` para accesibilidad.
* **Checkout Táctico (Zero Friction):** Sistema de conversión directo que puentea la base de datos de Sanity con un payload pre-formateado hacia WhatsApp, optimizando el cierre de ventas a nivel nacional.
* **Manejo de Escasez Visual:** Lógica condicional que detecta productos agotados, aplicando un tratamiento visual crudo (escala de grises + overlay) que bloquea la compra pero mantiene la prenda visible para alimentar la urgencia e historial del catálogo.
