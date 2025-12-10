import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Tag as TagIcon, Heart, HandCoins } from "lucide-react";
import ServiceDetailModal from "../ServiceDetail/ServiceDetail";

/* --------------------------------------------------------------------------
 * Interface do Serviço
 * -------------------------------------------------------------------------- */
interface Service {
  id: number;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  price?: string;
  negotiable?: boolean;
  duration?: string;
  status?: string;
  images: string[];
  likes?: number;
}

/* --------------------------------------------------------------------------
 * Componente PostCard com Partículas de Like
 * -------------------------------------------------------------------------- */
export default function PostCard({ service }: { service: Service }) {
 

  const [index, setIndex] = useState(0);
  const total = service.images.length;
  const touchStartX = useRef<number | null>(null);

  const [likeCount, setLikeCount] = useState(service.likes || 0);
  const [isHolding, setIsHolding] = useState(false);
  const [likeScale, setLikeScale] = useState(0);
  const [explode, setExplode] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; color: string }[]>([]);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // -------------------------- Swipe --------------------------
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const [open, setOpen]=useState(false);

  const onTouchStart = (e: React.TouchEvent) => touchStartX.current = e.touches[0].clientX;
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -60) next();
    else if (dx > 60) prev();
    touchStartX.current = null;
  };

  // -------------------------- Hold / Like --------------------------
  const startHold = () => {
    if (isHolding) return;
    setIsHolding(true);
    const start = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setLikeScale(Math.min(1 + elapsed / 1000, 2));
    }, 50);
  };

  const endHold = () => {
    if (!isHolding) return;
    setIsHolding(false);
    if (holdTimer.current) clearInterval(holdTimer.current);

    setLikeCount(c => c + 1);

    // Explosão do like
    const burst = Array.from({ length: 12 }).map(() => ({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      size: 6 + Math.random() * 12,
      color: Math.random() > 0.5 ? "var(--primary)" : "rgba(255,255,255,0.9)",
    }));
    setParticles(burst);
    setExplode(true);
    setTimeout(() => {
      setExplode(false);
      setParticles([]);
      setLikeScale(0);
    }, 500);
  };

    const handleDetail =()=>{
      setOpen(true);
    };

  return (
    <div className="pt-5 ">
    <div
      className={`relative bg-[var(--bg)] shadow-lg shadow-[#00000077] mx-auto w-[80vw] h-[80vh] md:w-[20vw] md:h-[60vh] rounded-2xl overflow-hidden`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ---------- Imagem de Fundo ---------- */}
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={service.images[index]}
          alt={service.title}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Desktop arrows */}
      
        <div className="absolute -top-20 inset-0 flex items-center justify-between px-4 z-20">
          <button onClick={prev} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition">
            <ArrowLeft className="text-white" />
          </button>
          <button onClick={next} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition">
            <ArrowRight className="text-white" />
          </button>
        </div>
      

      {/* Botão like canto superior */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
        <button
          onPointerDown={startHold}
          onPointerUp={endHold}
          className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-[var(--primary)]/70"
        >
          <Heart className="w-5 h-5 text-white" />
        </button>
        <span className="text-xs absolut text-white/90">{likeCount}</span>
      </div>

      {/* Like central */}
      <AnimatePresence>
        {(isHolding || explode) && (
          <motion.div
            className="absolute inset-0 -top-50 flex items-center justify-center pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: likeScale || 1, opacity: 0.9 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Heart size={Math.min(150, likeScale * 70)} className="text-[var(--primary)] drop-shadow-[0_0_25px_var(--primary)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partículas da explosão */}
      <AnimatePresence>
        {explode && particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0  -top-50  flex items-center justify-center pointer-events-none"
          >
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: "50%",
                filter: "blur(2px)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <div className="backdrop-blur-md bg-black/40 rounded-2xl border border-white/10 p-4 text-white">
          {(service.category || service.subcategory) && (
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <TagIcon size={14} />
              <span>{service.category}{service.subcategory ? ` · ${service.subcategory}` : ""}</span>
            </div>
          )}
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-3">{service.description}</p>
          <div className="flex items-center justify-between text-sm font-medium mb-2">
            {service.price && <span className="bg-white/10 px-3 flex gap-1 items-center py-1 rounded-full backdrop-blur-sm"><HandCoins size={16}/> {service.price}</span>}
            {service.duration && (
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Clock size={14} /> {service.duration}
              </span>
            )}
          </div>
          <div className="flex justify-between gap-2 mb-2">
            {service.negotiable && <span className="bg-yellow-500/30 px-2 py-1 rounded-full text-yellow-200 text-xs">Negociável</span>}
            {service.status && <span className="bg-blue-500/30 px-2 py-1 rounded-full text-blue-200 text-xs">Politica de cancelamento</span>}
          </div>
          <button 
          onClick={handleDetail}
          className="mt-2 w-full text-center bg-[var(--primary)]/80 hover:bg-[var(--primary)] py-2 rounded-xl font-medium text-white shadow-lg shadow-[var(--primary)]/20">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
    <ServiceDetailModal 
    service={service}
    isOpen={open}
    onClose={()=>{setOpen(false)}}
    />
</div>

  );
}
