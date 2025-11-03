import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Save, Trash2, PlusCircle } from "lucide-react";

/* --------------------------------------------------------------------------
 * Interface de dados do serviço
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
  requiresScheduling?: boolean;
  cancellationNotice?: string;
  acceptedTerms?: boolean;
  images: string[];
}

/* --------------------------------------------------------------------------
 * Componente principal do painel de serviços
 * -------------------------------------------------------------------------- */
export default function ServiceDashboard() {
  /* --------------------------- Estado inicial dos serviços --------------------------- */
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      title: "Desenvolvimento Web",
      description: "Criação de sites modernos, rápidos e responsivos.",
      price: "R$ 1.500",
      duration: "7 dias",
      category: "Tecnologia",
      subcategory: "Desenvolvimento",
      negotiable: true,
      requiresScheduling: false,
      acceptedTerms: true,
      images: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      ],
    },
  ]);

  /* --------------------------- Controle de seleção e responsividade --------------------------- */
  const [selectedId, setSelectedId] = useState<number>(services[0].id);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Controle de qual slide está visível no mobile (editor ou preview)
  const [mobileSlide, setMobileSlide] = useState<"editor" | "preview">(
    "editor"
  );

  // Direção do slide (para controlar animação de entrada/saída)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  /* --------------------------- Atualiza estado ao redimensionar a tela --------------------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* --------------------------- Serviço atualmente selecionado --------------------------- */
  const selectedService = services.find((s) => s.id === selectedId)!;

  /* --------------------------- Função para atualizar campos do serviço --------------------------- */
  const handleChange = (
    field: keyof Service,
    value: string | boolean | undefined | string[]
  ) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === selectedId ? { ...srv, [field]: value } : srv
      )
    );
  };

  /* --------------------------- Funções do editor de imagens --------------------------- */
  const addImage = () => {
    const url = prompt("Insira a URL da imagem");
    if (!url) return;
    handleChange("images", [...selectedService.images, url]);
  };

  const removeImage = (index: number) => {
    const newImages = selectedService.images.filter((_, i) => i !== index);
    handleChange("images", newImages);
  };

  /* --------------------------- Função de swipe lateral (mobile) --------------------------- */
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (mobileSlide === "editor") {
      // Editor: arrastar para esquerda → preview
      if (info.offset.x < -50) {
        setSlideDirection("right"); // preview entra pela direita
        setMobileSlide("preview");
      }
    } else if (mobileSlide === "preview") {
      // Preview: arrastar para direita → volta para editor
      if (info.offset.x > 50) {
        setSlideDirection("left"); // editor entra pela esquerda
        setMobileSlide("editor");
      }
    }
  };

  /* --------------------------- Variants do framer-motion para animação --------------------------- */
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  /* --------------------------- Estilo modal mobile --------------------------- */
  const mobileModalClass =
    "absolute top-10 left-4 right-4 bottom-10 bg-[var(--bg-light)] rounded-2xl shadow-lg border border-[var(--border)] p-6 flex flex-col overflow-auto";

  /* --------------------------------------------------------------------------
   * Renderização principal
   * -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen md:pt-15 pt-17 overflow-hidden bg-[var(--bg)] text-[var(--text)] flex flex-col md:flex-row transition-all duration-500 items-center justify-center">
      <div className="flex-1 relative flex overflow-hidden w-full max-w-[1024px]">

        {/* ----------------------------------------------------------------------
         * Editor do serviço
         * ----------------------------------------------------------------------
         * Modal no mobile, animação tipo slide usando framer-motion
         * ---------------------------------------------------------------------- */}
        <AnimatePresence initial={false} mode="wait">
          {(mobileSlide === "editor" || !isMobile) && (
            <motion.div
              key="editor"
              className={`${isMobile ? mobileModalClass : "w-1/2 p-6"}  md:ml-10 bg-[var(--bg-light)]  rounded-2xl shadow-lg border border-[var(--border)]`}
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              {/* --------------------------- Título e descrição --------------------------- */}
              <h3 className="text-xl font-bold mb-4">Editar Serviço</h3>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  <span className="text-[var(--text-muted)] text-sm mb-1">
                    Título do Serviço
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: Consultoria Jurídica, Design Gráfico..."
                    value={selectedService.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-[var(--text-muted)] text-sm mb-1">
                    Descrição detalhada
                  </span>
                  <textarea
                    placeholder="Descreva o serviço, incluindo detalhes importantes..."
                    value={selectedService.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    rows={4}
                    className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] resize-none"
                  />
                </label>

                {/* --------------------------- Categoria / Subcategoria --------------------------- */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Categoria</span>
                    <input
                      placeholder="Ex: Tecnologia, Beleza..."
                      type="text"
                      value={selectedService.category}
                      onChange={(e) =>
                        handleChange("category", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Subcategoria</span>
                    <input
                      placeholder="Ex: Desenvolvimento Web, Cabelereiro..."
                      type="text"
                      value={selectedService.subcategory}
                      onChange={(e) =>
                        handleChange("subcategory", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                </div>

                {/* --------------------------- Preço / Duração --------------------------- */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Preço (R$)</span>
                    <input
                      placeholder="Ex: R$ 200,00"
                      type="text"
                      value={selectedService.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Duração média</span>
                    <input
                      placeholder="Ex: 2 horas, 1 dia..."
                      type="text"
                      value={selectedService.duration}
                      onChange={(e) =>
                        handleChange("duration", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                </div>

                {/* --------------------------- Switches --------------------------- */}
                <div className="flex flex-col gap-3 mt-2">
                  {/* Preço negociável */}
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text)]">Preço negociável</span>
                    <input
                      type="checkbox"
                      checked={selectedService.negotiable}
                      onChange={(e) =>
                        handleChange("negotiable", e.target.checked)
                      }
                      className="relative w-10 h-5 appearance-none bg-[var(--border)] rounded-full cursor-pointer transition-all duration-300
                         checked:bg-[var(--primary)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4
                         after:bg-[var(--bg-light)] after:rounded-full after:transition-all checked:after:translate-x-5"
                    />
                  </label>

                  {/* Requer agendamento */}
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text)]">Exige agendamento prévio</span>
                    <input
                      type="checkbox"
                      checked={selectedService.requiresScheduling}
                      onChange={(e) =>
                        handleChange("requiresScheduling", e.target.checked)
                      }
                      className="relative w-10 h-5 appearance-none bg-[var(--border)] rounded-full cursor-pointer transition-all duration-300
                         checked:bg-[var(--primary)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4
                         after:bg-[var(--bg-light)] after:rounded-full after:transition-all checked:after:translate-x-5"
                    />
                  </label>

                  {/* Política de cancelamento */}
                  {selectedService.requiresScheduling && (
                    <label className="flex flex-col mt-2">
                      <span className="text-[var(--text-muted)] text-sm mb-1">
                        Política de cancelamento
                      </span>
                      <textarea
                        placeholder="Ex: Cancelamentos devem ser feitos com 24h de antecedência..."
                        value={selectedService.cancellationNotice}
                        onChange={(e) =>
                          handleChange("cancellationNotice", e.target.value)
                        }
                        rows={3}
                        className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] resize-none"
                      />
                    </label>
                  )}
                </div>

                {/* --------------------------- Editor de imagens --------------------------- */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Imagens do serviço</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedService.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)]"
                      >
                        <img
                          src={img}
                          alt={`Imagem ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-[var(--bg-dark)]/70 p-1 rounded-full text-white hover:bg-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addImage}
                      className="flex items-center justify-center w-24 h-24 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/20 transition"
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                </div>

                {/* --------------------------- Botão salvar --------------------------- */}
                <div className="mt-5 flex justify-center">
                  <button
                    className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
                    onClick={() => {
                      /* Chamada API comentada
                      fetch("/api/save-service", {
                        method: "POST",
                        body: JSON.stringify(selectedService),
                        headers: { "Content-Type": "application/json" },
                      });
                      */
                      alert("Salvo com sucesso (mock)");
                    }}
                  >
                    <Save size={18} /> Salvar alterações
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------------------------------------------------
         * Preview do serviço
         * ----------------------------------------------------------------------
         * Modal no mobile, animação tipo slide usando framer-motion
         * ---------------------------------------------------------------------- */}
      <AnimatePresence initial={false} mode="wait">
  {(mobileSlide === "preview" || !isMobile) && (
    <motion.div
      key="preview"
      className={`${isMobile ? mobileModalClass : "w-1/2 p-6"} md:ml-10 max-h-[90vh] bg-[var(--bg-light)] rounded-2xl shadow-lg border border-[var(--border)] `}
      custom={slideDirection}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {/* --------------------------- Imagem principal --------------------------- */}
      {selectedService.images[0] && (
        <img
          src={selectedService.images[0]}
          alt={selectedService.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* --------------------------- Informações do serviço --------------------------- */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          {selectedService.title}
        </h2>

        <p className="text-[var(--text-muted)] line-clamp-3">
          {selectedService.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <span className="font-semibold text-[var(--text)]">Categoria:</span>{" "}
            {selectedService.category || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Subcategoria:</span>{" "}
            {selectedService.subcategory || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Preço:</span>{" "}
            {selectedService.price || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Duração:</span>{" "}
            {selectedService.duration || "-"}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <div>
            <span className="font-semibold text-[var(--text)]">Negociável:</span>{" "}
            {selectedService.negotiable ? "Sim" : "Não"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Exige agendamento:</span>{" "}
            {selectedService.requiresScheduling ? "Sim" : "Não"}
          </div>
          {selectedService.requiresScheduling && (
            <div>
              <span className="font-semibold text-[var(--text)]">Política de cancelamento:</span>{" "}
              {selectedService.cancellationNotice || "-"}
            </div>
          )}
        </div>

        {/* --------------------------- Lista de imagens adicionais --------------------------- */}
        {selectedService.images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {selectedService.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Imagem ${idx + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-[var(--border)]"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )}
</AnimatePresence>

         {/* --------------------------- Indicadores de slide (mobile) --------------------------- */}
        {isMobile && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            <span
              className={`w-3 h-3 rounded-full transition-colors ${
                mobileSlide === "editor"
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--border)]"
              }`}
            />
            <span
              className={`w-3 h-3 rounded-full transition-colors ${
                mobileSlide === "preview"
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--border)]"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
