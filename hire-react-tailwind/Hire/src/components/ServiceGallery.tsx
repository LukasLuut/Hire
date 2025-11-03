/* --------------------------------------------------------------------------
 * ServiceGalleryZoom.tsx
 *
 * Componente React completo com:
 *  - Galeria interativa de serviços
 *  - Modal com zoom e navegação entre imagens
 *  - Barra de pesquisa com filtros inteligentes
 *  - Tags de sugestão (limitadas a 3 no mobile)
 *
 * Tecnologias usadas:
 *  - React + useState + useEffect
 *  - Framer Motion (animações suaves)
 *  - Lucide React (ícones vetoriais)
 *  - TailwindCSS (estilização responsiva)
 * -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Search, ArrowLeft, ArrowRight, X, Filter } from "lucide-react";

/* --------------------------------------------------------------------------
 * MOCK DE DADOS
 * Aqui simulamos alguns serviços para demonstração.
 * Em um projeto real, esses dados viriam de uma API ou banco de dados.
 * -------------------------------------------------------------------------- */
const services = [
  {
    id: 1,
    title: "Design de Interface",
    description: "Criação de telas otimizadas com foco em UX e responsividade.",
    category: "UI/UX",
    price: "R$500",
    duration: "2 dias",
    rating: 4.8,
    images: ["/img/zumbi.gif", "/img/uiux2.jpg"],
  },
  {
    id: 2,
    title: "Prototipagem Rápida",
    description: "Protótipos interativos no Figma para testes de usabilidade.",
    category: "Design",
    price: "R$350",
    duration: "1 dia",
    rating: 4.5,
    images: ["/img/prototipo1.jpg", "/img/prototipo2.jpg"],
  },
  {
    id: 3,
    title: "Consultoria de Experiência",
    description: "Análise de jornada do usuário e melhorias em UX/UI.",
    category: "Consultoria",
    price: "R$800",
    duration: "3 dias",
    rating: 5.0,
    images: ["/img/ux1.jpg", "/img/ux2.jpg"],
  },
];

/* ==========================================================================
 * COMPONENTE PRINCIPAL
 * ========================================================================== */
export default function ServiceGalleryZoom() {
  /* ------------------------------------------------------------------------
   * ESTADOS PRINCIPAIS
   * ------------------------------------------------------------------------ */
  const [selectedService, setSelectedService] = useState<number | null>(null); // índice do serviço selecionado
  const [currentImage, setCurrentImage] = useState<number>(0); // índice da imagem atual no modal
  const [searchTerm, setSearchTerm] = useState(""); // texto digitado na barra de busca
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null); // ordenação por preço
  const [minRating, setMinRating] = useState<number>(0); // nota mínima
  const [filtered, setFiltered] = useState(services); // lista filtrada
  const [isMobile, setIsMobile] = useState(false); // controle de largura da tela

  // Obtém o serviço atualmente selecionado
  const service = selectedService !== null ? services[selectedService] : null;

  /* ------------------------------------------------------------------------
   * TAGS DE SUGESTÃO
   * (exibidas abaixo da barra de pesquisa)
   * ------------------------------------------------------------------------ */
  const tags = ["UI", "UX", "Prototipagem", "Design", "Consultoria", "Mobile", "Figma", "Landing Page"];

  // Detecta se a tela é pequena (para limitar o número de tags)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ------------------------------------------------------------------------
   * FILTRO DINÂMICO
   * Aplica filtros e busca conforme o usuário digita ou seleciona opções.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    let results = [...services];

    // Busca por texto em título, descrição e categoria
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (srv) =>
          srv.title.toLowerCase().includes(term) ||
          srv.description.toLowerCase().includes(term) ||
          srv.category.toLowerCase().includes(term)
      );
    }

    // Ordenação por preço
    if (priceOrder) {
      results.sort((a, b) => {
        const pa = parseFloat(a.price.replace(/[^\d,]/g, "").replace(",", "."));
        const pb = parseFloat(b.price.replace(/[^\d,]/g, "").replace(",", "."));
        return priceOrder === "asc" ? pa - pb : pb - pa;
      });
    }

    // Filtro de nota mínima
    if (minRating > 0) {
      results = results.filter((srv) => srv.rating >= minRating);
    }

    setFiltered(results);
  }, [searchTerm, priceOrder, minRating]);

  /* ------------------------------------------------------------------------
   * NAVEGAÇÃO ENTRE IMAGENS
   * Botões do modal (próxima e anterior)
   * ------------------------------------------------------------------------ */
  const handlePrev = () => {
    if (!service) return;
    setCurrentImage((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  const handleNext = () => {
    if (!service) return;
    setCurrentImage((prev) => (prev + 1) % service.images.length);
  };

  /* ==========================================================================
   * RENDERIZAÇÃO
   * ========================================================================== */
  return (
    <LayoutGroup>
      <div className="min-h-screen bg-[var(--bg-dark)] overflow-x-hidden text-[var(--text)]/80  px-6 md:px-20 transition-colors duration-300">
        {/* ------------------------------------------------------------------
         * CABEÇALHO
         * ------------------------------------------------------------------ */}
        <h1 className="text-5xl font-bold text-center mb-6 pb-3 border-b-2 border-[var(--text)]/50">
          Galeria de Serviços
        </h1>

        {/* ------------------------------------------------------------------
         * BARRA DE PESQUISA + TAGS + FILTROS
         * ------------------------------------------------------------------ */}
        <div className="flex flex-col items-center mb-10">
          {/* Campo de busca */}
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, categoria ou descrição..."
              className="w-full py-3 pl-12 pr-16 rounded-full bg-black/10 border border-[var(--text)]/30 text-[var(--text)] placeholder-[var(--text)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            />
            <Search className="absolute left-4 top-3.5 text-[var(--text)]/60" size={20} />
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-4.5 text-[var(--text)]/60 hover:text-[var(--primary)]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tags sugeridas */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {tags.slice(0, isMobile ? 3 : tags.length).map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className={`px-3 py-1 rounded-full text-sm border border-[var(--text)]/30 hover:border-[var(--primary)] hover:text-[var(--primary)] transition ${
                  searchTerm === tag ? "bg-[var(--primary)]/20 border-[var(--primary)]" : ""
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>

          {/* Filtros adicionais */}
          <div className="flex flex-wrap bg-[var(--bg)] md:rounded-full rounded-2xl py-1 px-4 justify-center gap-4 mt-5 text-sm">
            {/* Filtro de preço */}
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span>Preço:</span>
              <button
                onClick={() => setPriceOrder("asc")}
                className={`px-2 py-1 rounded ${priceOrder === "asc" ? "bg-[var(--primary)]/30" : "hover:bg-black/20"}`}
              >
                ↑
              </button>
              <button
                onClick={() => setPriceOrder("desc")}
                className={`px-2 py-1 rounded ${priceOrder === "desc" ? "bg-[var(--primary)]/30" : "hover:bg-black/20"}`}
              >
                ↓
              </button>
              <button onClick={() => setPriceOrder(null)} className="px-2 py-1 rounded hover:bg-black/20">
                Reset
              </button>
            </div>

            {/* Filtro de avaliação */}
            <div className="flex items-center  gap-2">
              <span>Nota mínima:</span>
              {[0, 4, 4.5, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setMinRating(n)}
                  className={`px-2  py-1 rounded ${minRating === n ? "bg-[var(--primary)]/30" : "hover:bg-black/20"}`}
                >
                  {n === 0 ? "Todas" : `${n}★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
         * GRADE DE CARDS
         * ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((srv, idx) => (
            <motion.div
              key={srv.id}
              layoutId={`card-${srv.id}`}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedService(idx);
                setCurrentImage(0);
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Imagem principal do card */}
              <motion.img
                src={srv.images[0]}
                alt={srv.title}
                className="w-full h-64 object-cover"
                layoutId={`image-${srv.id}`}
              />

              {/* Overlay no hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
                initial="initial"
                whileHover="hover"
                variants={{
                  initial: { opacity: 0, backdropFilter: "blur(0px)" },
                  hover: { opacity: 1, backdropFilter: "blur(6px)" },
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  className="text-white text-xl font-bold text-center px-2"
                  variants={{
                    initial: { opacity: 0, y: 20 },
                    hover: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {srv.title}
                </motion.h3>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ------------------------------------------------------------------
         * MODAL DE ZOOM
         * ------------------------------------------------------------------ */}
        <AnimatePresence>
          {selectedService !== null && service && (
            <>
              {/* Fundo escurecido */}
              <motion.div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
              />

              {/* Card ampliado */}
              <motion.div
                layoutId={`card-${service.id}`}
                className="fixed z-50  inset-0 flex items-center justify-center p-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  className="relative  w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
                >
                  {/* Imagem ampliada */}
                  <motion.img
                    key={currentImage}
                    src={service.images[currentImage]}
                    alt={service.title}
                    className="w-full h-96 object-cover"
                    layoutId={`image-${service.id}`}
                    transition={{ duration: 0.35 }}
                  />

                  {/* Informações e botões */}
                  <motion.div
                    className="absolute  bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg p-6 md:p-8 text-white"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Título, preço e duração */}
                    <div className="flex flex-row items-end gap-3">
                      <h2 className="text-2xl font-bold">{service.title}</h2>
                      <div className="flex items-end gap-2">
                        <span className="text-[var(--primary)] font-semibold">{service.price}</span>
                        <span className="text-sm text-white/50">{service.duration}</span>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-white/70 mt-2">{service.description}</p>

                    {/* Navegação entre imagens */}
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 -top-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 -top-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
                    >
                      <ArrowRight size={24} />
                    </button>

                    {/* Fechar modal */}
                    <button
                      onClick={() => setSelectedService(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
                    >
                      <X size={22} />
                    </button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
