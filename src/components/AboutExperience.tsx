import React from 'react';
import {
  Sparkle,
  ArrowUpRight,
  ArrowLeft,
  Cookie,
  Flame,
  Heart,
  ChefHat,
  Coffee,
  ShoppingBag,
  PackageCheck,
  Star,
  Mail,
  Phone,
  Instagram,
} from 'lucide-react';

interface AboutExperienceProps {
  onBackToHome?: () => void;
}

export default function AboutExperience({ onBackToHome }: AboutExperienceProps) {
  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.hash = '#inicio';
    }
  };

  // Row 1 Cookie Craft Icons
  const row1Icons = [
    { icon: Cookie, label: 'Cookie' },
    { icon: Flame, label: 'Horno' },
    { icon: Heart, label: 'Amor' },
    { icon: ChefHat, label: 'Receta' },
    { icon: Sparkle, label: 'Magia' },
    { icon: Coffee, label: 'Café' },
    { icon: ShoppingBag, label: 'Bolsa' },
    { icon: PackageCheck, label: 'Envíos' },
  ];

  // Row 2 Cookie Craft Icons
  const row2Icons = [
    { icon: Star, label: 'Calidad' },
    { icon: Cookie, label: 'Galletas' },
    { icon: PackageCheck, label: 'Fresco' },
    { icon: Heart, label: 'Artesanal' },
    { icon: ChefHat, label: 'Pasión' },
    { icon: Flame, label: 'Horneado' },
    { icon: Coffee, label: 'Maridaje' },
    { icon: Sparkle, label: 'Topping' },
  ];

  return (
    <div
      id="about-experience"
      className="w-full min-h-screen bg-[#0a0a0a] text-white p-6 sm:p-8 lg:p-10 overflow-y-auto font-sans antialiased flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between my-auto">
        {/* Encabezado con mb-6 respecto a la grilla */}
        <header
          id="aboutHeaderRow"
          className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0"
        >
          {/* Lado izquierdo: Título principal e Introducción de Cookie Planet */}
          <div>
            <h1
              id="aboutTitle"
              className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white mb-1.5"
            >
              ¡Hola! Somos Cookie Planet.
            </h1>
            <p
              id="aboutBio"
              className="max-w-xl text-white/70 text-xs sm:text-[13px] leading-relaxed"
            >
              Horneamos galletas artesanales creadas para llevar felicidad y dulzura a cada bocado.
              Ingredientes de la más alta calidad, masa suave por dentro, bordes crujientes y
              rellenos irresistibles hechos para sorprenderte en cada entrega.
            </p>
          </div>

          {/* Lado derecho: Botón de retorno discreto y Botón "Haz tu Pedido" */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-end md:self-center">
            <a
              id="btnAboutBack"
              href="#inicio"
              onClick={handleReturn}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono tracking-wider uppercase text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>VOLVER</span>
            </a>

            <a
              id="btnTeamUp"
              href="https://wa.me/51987654321?text=Hola%20Cookie%20Planet!%20Quiero%20hacer%20un%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass px-4 sm:px-5 py-2 sm:py-2.5 rounded-full inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white/90 hover:text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer shrink-0"
            >
              <Sparkle className="h-3.5 w-3.5 text-amber-300" strokeWidth={1.5} />
              <span>Haz tu Pedido</span>
            </a>
          </div>
        </header>

        {/* Grilla Bento (3 Columnas con la misma altura total y separación gap-5) */}
        <main
          id="aboutCardsGrid"
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 h-auto md:h-[750px] lg:h-[calc(100vh-160px)] md:min-h-[640px] md:max-h-[800px]"
        >
          {/* ==================== COLUMNA 1 - Card Background / Trayectoria ==================== */}
          <div
            id="cardBackground"
            className="h-full w-full relative rounded-2xl md:rounded-3xl overflow-hidden bg-black flex flex-col justify-between p-5 sm:p-6 border border-white/10 group shadow-2xl min-h-[400px] md:min-h-0"
          >
            {/* Video de fondo en autoplay loop muted playsInline */}
            <video
              id="videoBackground"
              src="https://res.cloudinary.com/yxbhso8s/video/upload/v1789505848/mujer_rostro_misterio.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Dark gradient overlay for superior text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60 pointer-events-none" />

            {/* Etiqueta superior centrada: "BACKGROUND" flanqueada por íconos Sparkle */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-1 shrink-0">
              <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
              <span className="uppercase tracking-[0.22em] text-[11px] text-white/70 font-mono">
                BACKGROUND
              </span>
              <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
            </div>

            {/* Parte inferior: Grilla de pilares de Cookie Planet */}
            <div
              id="timelineCard"
              className="relative z-10 w-full p-3.5 sm:p-4 rounded-xl md:rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shrink-0"
            >
              <div
                id="timelineGrid"
                className="grid grid-cols-[auto_auto_1fr] items-center gap-x-2 sm:gap-x-2.5 gap-y-2.5 text-[11.5px] sm:text-xs text-white/90 font-mono"
              >
                {/* 1. Horneado Diario · Galletas recién hechas cada mañana. */}
                <span className="text-white font-medium whitespace-nowrap">Horneado Diario</span>
                <Sparkle className="h-2.5 w-2.5 text-amber-300/80 shrink-0" strokeWidth={1.5} />
                <span className="text-white/75 text-[11px] sm:text-xs leading-snug">Galletas recién hechas cada mañana.</span>

                {/* 2. Receta Secreta · Ingredientes premium y toppings top. */}
                <span className="text-white font-medium whitespace-nowrap">Receta Secreta</span>
                <Sparkle className="h-2.5 w-2.5 text-amber-300/80 shrink-0" strokeWidth={1.5} />
                <span className="text-white/75 text-[11px] sm:text-xs leading-snug">Ingredientes premium y toppings top.</span>

                {/* 3. Envíos Rápidos · Entregas frescas a la puerta de tu casa. */}
                <span className="text-white font-medium whitespace-nowrap">Envíos Rápidos</span>
                <Sparkle className="h-2.5 w-2.5 text-amber-300/80 shrink-0" strokeWidth={1.5} />
                <span className="text-white/75 text-[11px] sm:text-xs leading-snug">Entregas frescas a la puerta de tu casa.</span>
              </div>
            </div>
          </div>

          {/* ==================== COLUMNA 2 (Client Voice / 5,000+ Galletas) ==================== */}
          <div
            id="aboutCol2"
            className="h-full grid grid-rows-[auto_1fr] gap-5"
          >
            {/* Card Superior - Client Voice (altura natural) */}
            <div
              id="cardClientVoice"
              className="rounded-2xl md:rounded-3xl bg-[#324444] p-5 sm:p-5.5 noise-overlay relative overflow-hidden flex flex-col justify-between border border-white/10 shrink-0 shadow-lg min-h-[170px]"
            >
              <div className="relative z-10">
                {/* Etiqueta "CLIENT VOICE" con ícono Sparkle */}
                <div className="flex items-center gap-1.5 uppercase tracking-[0.22em] text-[11px] text-white/70 font-mono">
                  <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                  <span>CLIENT VOICE</span>
                </div>

                {/* Cita de testimonio */}
                <p
                  id="clientVoiceQuote"
                  className="text-xs sm:text-[13px] leading-[1.6] text-white/90 mt-3 font-normal"
                >
                  "¡Las mejores galletas con chispas de chocolate y Nutella que he probado!"
                </p>
              </div>

              {/* Atribución */}
              <div id="clientVoiceAuthor" className="mt-3.5 text-[11.5px] sm:text-xs text-white/75 relative z-10">
                <span className="font-semibold text-white">Cliente Feliz</span> — Cookie Planet Lover
              </div>
            </div>

            {/* Card Inferior - Métricas (5,000+ Galletas Entregadas / 100% Recién Horneadas) */}
            <div
              id="card10M"
              className="h-full min-h-[220px] sm:min-h-[240px] flex flex-col justify-between items-center text-center rounded-2xl md:rounded-3xl bg-black relative overflow-hidden p-5 sm:p-6 pb-5 sm:pb-6 border border-white/10 shadow-2xl"
            >
              {/* Video de fondo */}
              <video
                id="video10M"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_154543_d5b83fc1-9cea-44f3-b5e8-8f325935211a.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Top spacer */}
              <div className="relative z-10 opacity-0 pointer-events-none text-xs">·</div>

              {/* Texto masivo centrado */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
                <div
                  id="heading10M"
                  className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight drop-shadow text-white leading-none"
                >
                  5,000+
                </div>
              </div>

              {/* Leyenda inferior */}
              <div
                id="subtext10M"
                className="text-white/85 text-xs sm:text-sm relative z-10 font-medium tracking-wide shrink-0"
              >
                Galletas Entregadas · 100% Recién Horneadas
              </div>
            </div>
          </div>

          {/* ==================== COLUMNA 3 (Cookie Craft / Reach Me) ==================== */}
          <div
            id="aboutCol3"
            className="h-full grid grid-rows-[1fr_auto] gap-5"
          >
            {/* Card Superior - Cookie Craft con marquee deslizante */}
            <div
              id="cardDailySoftware"
              className="h-full min-h-[220px] sm:min-h-[240px] md:min-h-[260px] flex flex-col justify-between rounded-2xl md:rounded-3xl bg-black relative overflow-hidden p-5 sm:p-5.5 border border-white/10 shadow-2xl"
            >
              {/* Video de fondo */}
              <video
                id="videoDailySoftware"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260507_153148_d7a3e1dd-e5d0-4ce6-8306-00d7522ecc44.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/50 pointer-events-none" />

              {/* Etiqueta superior */}
              <div className="flex items-center gap-1.5 uppercase tracking-[0.22em] text-[11px] text-white/70 font-mono relative z-10 mb-2 shrink-0">
                <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                <span>COOKIE CRAFT</span>
              </div>

              {/* Marquee deslizante infinito centrado con 2 filas de íconos en contenedores .liquid-glass */}
              <div className="relative z-10 w-full overflow-hidden flex flex-col gap-2.5 marquee-mask py-1 my-auto">
                {/* Fila 1 (scroll izquierda) */}
                <div id="marqueeRow1" className="flex gap-2.5 w-max animate-marquee-left">
                  {[...row1Icons, ...row1Icons].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={`row1-${idx}`}
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl liquid-glass flex items-center justify-center text-white/90 shrink-0"
                        title={item.label}
                      >
                        <IconComponent className="h-5 w-5 sm:h-5.5 sm:w-5.5" strokeWidth={1.5} />
                      </div>
                    );
                  })}
                </div>

                {/* Fila 2 (scroll derecha) */}
                <div id="marqueeRow2" className="flex gap-2.5 w-max animate-marquee-right">
                  {[...row2Icons, ...row2Icons].map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={`row2-${idx}`}
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl liquid-glass flex items-center justify-center text-white/90 shrink-0"
                        title={item.label}
                      >
                        <IconComponent className="h-5 w-5 sm:h-5.5 sm:w-5.5" strokeWidth={1.5} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom spacer */}
              <div className="relative z-10 opacity-0 pointer-events-none text-xs shrink-0">·</div>
            </div>

            {/* Card Inferior - Reach Me (Contacto Cookie Planet) */}
            <div
              id="cardReachMe"
              className="rounded-2xl md:rounded-3xl bg-[#324444] p-5 sm:p-6 pb-5 sm:pb-6 noise-overlay relative overflow-hidden flex flex-col justify-between border border-white/10 shrink-0 shadow-lg min-h-[160px] sm:min-h-[175px]"
            >
              <div className="flex items-center justify-between relative z-10">
                {/* Etiqueta: "REACH ME" con Sparkle */}
                <div className="flex items-center gap-1.5 uppercase tracking-[0.22em] text-[11px] text-white/70 font-mono">
                  <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                  <span>REACH ME</span>
                </div>

                {/* Botón superior derecho con icono ArrowUpRight hacia WhatsApp */}
                <a
                  id="btnReachMeArrow"
                  href="https://wa.me/51987654321?text=Hola%20Cookie%20Planet!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Contactar Cookie Planet por WhatsApp"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
              </div>

              {/* Datos de contacto: Email, WhatsApp e Instagram */}
              <div className="relative z-10 flex flex-col gap-2 mt-3.5">
                <a
                  id="linkReachEmail"
                  href="mailto:pedidos@cookieplanet.pe"
                  className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-200"
                >
                  <Mail className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                  <span>pedidos@cookieplanet.pe</span>
                </a>

                <a
                  id="linkReachPhone"
                  href="https://wa.me/51987654321?text=Hola%20Cookie%20Planet!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-200"
                >
                  <Phone className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                  <span>+51 987 654 321 (WhatsApp)</span>
                </a>

                <a
                  id="linkReachInstagram"
                  href="https://instagram.com/cookieplanet.pe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-200"
                >
                  <Instagram className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
                  <span>@cookieplanet.pe</span>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

