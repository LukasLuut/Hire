import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Handshake,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ServiceNegotiationModal from "../../Negotiation/ServiceNegotiationModal";

/* --------------------------------------------------------------------------
 * Tipos
 * -------------------------------------------------------------------------- */
interface Service {
  id: number;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  price?: string;
  duration?: string;
  negotiable?: boolean;
  requiresScheduling?: boolean;
  cancellationNotice?: string;
  images: string[];
  // provider:string
}

interface ServiceDetailProps {
  service: Service;
  images: string[]
  isOpen: boolean;
  onClose: () => void;
}

/* --------------------------------------------------------------------------
 * Componente principal
 * -------------------------------------------------------------------------- */
export default function ServiceDetail({
  service,
  images,
  isOpen,
  onClose,
}: ServiceDetailProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [direction, setDirection] = useState(0);
  const [liked, setLiked] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [Open, setOpen]=useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ----------------------- Auto-play inteligente ----------------------- */
  useEffect(() => {
    if (!isOpen || isDragging) return;

    intervalRef.current = setInterval(() => {
      slideNext();
    }, 7000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, isDragging]);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    setIsDragging(false);

    if (offset < -50 || velocity < -500) slideNext();
    else if (offset > 50 || velocity > 500) slidePrev();
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const handleNegociar =()=>{
    setOpen(true);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ----------------------- Modal principal ----------------------- */}
          <motion.div
            key="preview"
            className="relative w-[92%] md:w-[640px] max-h-[92vh] overflow-y-auto bg-[var(--bg-light)] rounded-3xl shadow-2xl border border-[var(--border)] flex flex-col"
            custom={direction}
            variants={variants}
            initial={{ scale: 0.8, opacity: 0 }}
             animate={{ 
          scale: [0.8,  1], 
          opacity: 1 
        }}
        exit={{ scale: [1,  0.7], opacity: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.175, 0.885, 0.32, 1.275], // curva com bounce suave
          times: [0,  1],
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
          >
            {/* ----------------------- Botão fechar ----------------------- */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-[var(--text)] hover:text-[var(--primary)] transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* ----------------------- Carrossel ----------------------- */}
            <div className="relative w-full h-72 md:h-80 overflow-hidden rounded-t-3xl select-none">
              <AnimatePresence custom={direction} mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt={service.title}
                  className="absolute w-full h-full object-cover cursor-pointer"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setImageModalOpen(true)}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>

              {/* Ícone de like */}
              <button
                onClick={() => setLiked((prev) => !prev)}
                className="absolute top-1 right-11 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10 transition"
              >
                <Heart
                  size={20}
                  className={`transition-transform ${
                    liked ? "fill-[var(--primary)] scale-110" : "scale-100"
                  }`}
                />
              </button>

              {/* Botões laterais (desktop) */}
              <button
                onClick={slidePrev}
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white z-10 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={slideNext}
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white z-10 transition"
              >
                <ChevronRight size={22} />
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "bg-[var(--primary)] scale-125"
                        : "bg-[var(--text-muted)] opacity-60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ----------------------- Conteúdo ----------------------- */}
            <div className="p-6 flex flex-col gap-4 text-[var(--text)]">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary)] mb-1">
                  {service.title}
                </h2>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Informações gerais */}
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <Info label="Categoria" value={service.category} />
                <Info label="Subcategoria" value={service.subcategory} />
                <Info label="Preço" value={"R$" + service.price + ",00 "} />
                <Info label="Duração" value={service.duration} />
                <Info
                  label="Negociável"
                  value={service.negotiable ? "Sim" : "Não"}
                />
                <Info
                  label="Agendamento"
                  value={service.requiresScheduling ? "Sim" : "Não"}
                />
                {service.requiresScheduling && (
                  <Info
                    label="Política de cancelamento"
                    value={service.cancellationNotice}
                    spanFull
                  />
                )}
              </div>

              {/* ----------------------- Ações ----------------------- */}
              <div className="flex gap-3 mt-4">
                <button 
                onClick={handleNegociar}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                  <Handshake size={18} />
                  Contratar / Negociar
                </button>

                <button className="flex-1 flex items-center justify-center gap-2 border border-[var(--primary)] text-[var(--text)] font-semibold py-3 rounded-xl hover:bg-[var(--primary)] hover:text-[var(--bg-light)] hover:scale-[1.02] hover:shadow-lg transition-all">
                  <MessageCircle size={18} />
                  Mensagem
                </button>
              </div>
            </div>
          </motion.div>

          {/* ----------------------- Modal de imagens ----------------------- */}
          <ImageGalleryModal
            images={images}
            open={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            startIndex={currentIndex}
          />

        
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------------------------
 * Subcomponente Info (rótulo + valor)
 * -------------------------------------------------------------------------- */
function Info({
  label,
  value,
  spanFull = false,
}: {
  label: string;
  value?: string;
  spanFull?: boolean;
}) {
  return (
    <div className={`${spanFull ? "col-span-2" : ""}`}>
      <span className="font-semibold">{label}: </span>
      <span className="text-[var(--text-muted)]">
        {value !== "" ? value : "-"}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Modal de Galeria de Imagens (fullscreen)
 * -------------------------------------------------------------------------- */
function ImageGalleryModal({
  images,
  open,
  onClose,
  startIndex = 0,
}: {
  images: string[];
  open: boolean;
  onClose: () => void;
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex);
  const [dir, setDir] = useState(0);

  useEffect(() => setIndex(startIndex), [startIndex]);

  const next = () => {
    setDir(1);
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setDir(-1);
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[var(--primary)]"
          >
            <X size={26} />
          </button>

          <AnimatePresence custom={dir} mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-lg"
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Controles */}
          <button
            onClick={prev}
            className="absolute left-6 text-white hover:text-[var(--primary)] transition"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 text-white hover:text-[var(--primary)] transition"
          >
            <ChevronRight size={32} />
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === index
                    ? "bg-[var(--primary)] scale-125"
                    : "bg-white/40"
                } transition-all`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
