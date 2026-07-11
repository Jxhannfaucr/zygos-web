"use client";

import { useEffect, useRef } from "react";

export default function AnimatedHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const container = containerRef.current as HTMLDivElement;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let cellSize = 56;
    let cols = 0;
    let rows = 0;
    let centerX = 0;
    let centerY = 0;
    let maxDist = 1;
    let pts: any[] = [];

    const particles: any[] = [];
    const dataPoints: any[] = [];
    const cam = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    // ==========================================
    // CONFIGURACIÓN DE MARCAS Y COLORES NEÓN
    // ==========================================
    const BRANDS = [
      "ZYGOS (SOON)", "SUPREME", "HELLSTAR", "GODSPEED", 
      "MIXED EMOTION", "BAPE", "LIFE HUSTLER", "DUAA", "VALLE DREAMS", "MAJESTIK",
      "+MÁS"
    ]; // <-- Modifica esta lista con tus marcas

    const NEON_COLORS = [
      "0, 255, 255",   // Cyan
      "255, 0, 255",   // Magenta
      "57, 255, 20",   // Verde Neón
      "255, 255, 0",   // Amarillo
      "255, 49, 49",   // Rojo Neón
    ];

    function smoothstep(e0: number, e1: number, x: number) {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    }

    function flow(x: number, y: number, t: number) {
      return (
        (Math.sin(x * 0.0085 + t * 0.15) * 0.5 +
          Math.sin(y * 0.011 - t * 0.12) * 0.35 +
          Math.sin((x + y) * 0.006 + t * 0.09) * 0.4 +
          Math.sin(Math.sqrt(x * x + y * y) * 0.009 - t * 0.1) * 0.3) /
        1.55
      );
    }

    function edgeFactorAt(px: number, py: number) {
      const dx = px - centerX;
      const dy = py - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
      return smoothstep(0.22, 0.88, dist);
    }

    function buildGrid() {
      pts = [];
      for (let gy = 0; gy <= rows; gy++) {
        const row = [];
        for (let gx = 0; gx <= cols; gx++) {
          row.push({ x: 0, y: 0, z: 0, ef: 0 });
        }
        pts.push(row);
      }
    }

    function initParticles() {
      particles.length = 0;
      const count = width < 640 ? 24 : width < 1024 ? 36 : 46;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.1 + 0.4,
          speed: Math.random() * 0.12 + 0.03,
          phase: Math.random() * Math.PI * 2,
          baseAlpha: Math.random() * 0.35 + 0.15,
        });
      }
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cellSize = width < 640 ? 46 : width < 1024 ? 52 : 60;
      cols = Math.ceil(width / cellSize) + 2;
      rows = Math.ceil(height / cellSize) + 2;
      centerX = width / 2;
      centerY = height / 2;
      maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      buildGrid();
      initParticles();
    }

    function handleMouse(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }

    function updateGrid(t: number) {
      const offsetX = -cellSize;
      const offsetY = -cellSize;
      for (let gy = 0; gy <= rows; gy++) {
        for (let gx = 0; gx <= cols; gx++) {
          const bx = offsetX + gx * cellSize;
          const by = offsetY + gy * cellSize;
          const z = flow(bx, by, t);
          const p = pts[gy][gx];
          p.x = bx + flow(by, bx, t * 0.8 + 100) * cellSize * 0.25;
          p.y = by + z * cellSize * 0.55;
          p.z = z;
          p.ef = edgeFactorAt(p.x, p.y);
        }
      }
    }

    function drawMesh() {
      ctx.lineWidth = 1;
      for (let gy = 0; gy <= rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const a = pts[gy][gx];
          const b = pts[gy][gx + 1];
          const ef = (a.ef + b.ef) / 2;
          if (ef <= 0.012) continue;
          const depth = ((a.z + b.z) / 2 + 1) / 2;
          const alpha = ef * (0.035 + depth * 0.11);
          ctx.strokeStyle = `rgba(150,150,150,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      for (let gx = 0; gx <= cols; gx++) {
        for (let gy = 0; gy < rows; gy++) {
          const a = pts[gy][gx];
          const b = pts[gy + 1][gx];
          const ef = (a.ef + b.ef) / 2;
          if (ef <= 0.012) continue;
          const depth = ((a.z + b.z) / 2 + 1) / 2;
          const alpha = ef * (0.035 + depth * 0.11);
          ctx.strokeStyle = `rgba(150,150,150,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    function drawParticles(t: number) {
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t * 0.6 + p.phase);
        const ef = edgeFactorAt(p.x, p.y);
        const alpha = p.baseAlpha * twinkle * (0.25 + ef * 0.75);
        if (alpha <= 0.012) continue;
        ctx.beginPath();
        ctx.fillStyle = `rgba(190,190,190,${alpha.toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function maybeSpawnDataPoint(t: number) {
      // Modificación: Permitimos hasta 5 textos al mismo tiempo y subimos la probabilidad de spawn a 0.015
      if (dataPoints.length >= 5 || Math.random() > 0.015) return;
      const corner = Math.floor(Math.random() * 4);
      const margin = 50;
      let x, y;
      if (corner === 0) {
        x = margin + Math.random() * width * 0.22;
        y = margin + Math.random() * height * 0.22;
      } else if (corner === 1) {
        x = width - margin - Math.random() * width * 0.22;
        y = margin + Math.random() * height * 0.22;
      } else if (corner === 2) {
        x = margin + Math.random() * width * 0.22;
        y = height - margin - Math.random() * height * 0.22;
      } else {
        x = width - margin - Math.random() * width * 0.22;
        y = height - margin - Math.random() * height * 0.22;
      }
      
      // Asignamos una marca y un color aleatorio en lugar del hex
      const label = BRANDS[Math.floor(Math.random() * BRANDS.length)];
      const color = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

      dataPoints.push({ x, y, label, color, born: t, life: 2.0 + Math.random() * 1.5 });
    }

    function drawDataPoints(t: number) {
      ctx.font = "bold 11px ui-monospace, 'JetBrains Mono', monospace"; // Hice la fuente en negrita
      ctx.textBaseline = "middle";
      for (let i = dataPoints.length - 1; i >= 0; i--) {
        const d = dataPoints[i];
        const age = t - d.born;
        if (age > d.life) {
          dataPoints.splice(i, 1);
          continue;
        }
        const fadeIn = smoothstep(0, 0.3, age);
        const fadeOut = 1 - smoothstep(d.life - 0.6, d.life, age);
        
        // Control de opacidad máxima (0.6 para no saturar)
        const alpha = fadeIn * fadeOut * 0.6; 
        
        // Efecto Neon (Sombra)
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${d.color}, ${alpha})`;

        ctx.fillStyle = `rgba(${d.color}, ${alpha.toFixed(3)})`;
        ctx.fillText(d.label, d.x, d.y);

        // Reset de sombra para no afectar otras partes del canvas
        ctx.shadowBlur = 0;
      }
    }

    let raf: number;
    let start: number | null = null;

    function frame(ts: number) {
      if (start === null) start = ts;
      const t = (ts - start) / 1000;

      cam.x += (mouse.x - cam.x) * 0.04;
      cam.y += (mouse.y - cam.y) * 0.04;
      const driftX = Math.sin(t * 0.05) * 0.2;
      const driftY = Math.cos(t * 0.04) * 0.15;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate((cam.x + driftX) * 7, (cam.y + driftY) * 5);
      updateGrid(t);
      drawMesh();
      ctx.restore();

      ctx.save();
      ctx.translate((cam.x + driftX) * 13, (cam.y + driftY) * 9);
      drawParticles(t);
      maybeSpawnDataPoint(t);
      drawDataPoints(t);
      ctx.restore();

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);

    if (reduceMotion) {
      frame(0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-black pointer-events-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' result='t'/><feColorMatrix in='t' type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="absolute inset-0 hero-scanlines" />

      <style>{`
        .hero-scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.022) 0px,
            rgba(255, 255, 255, 0.022) 1px,
            transparent 1px,
            transparent 3px
          );
          animation: hero-scanline-drift 24s linear infinite;
        }
        @keyframes hero-scanline-drift {
          0% { background-position: 0 0; }
          100% { background-position: 0 240px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scanlines { animation: none; }
        }
      `}</style>
    </div>
  );
}