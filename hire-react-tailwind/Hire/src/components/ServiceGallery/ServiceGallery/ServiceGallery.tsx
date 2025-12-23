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
import { motion,  LayoutGroup } from "framer-motion";
import { Search, X, Filter } from "lucide-react";
import PostCard from "../Service/Service";
import { providerApi } from "../../../api/ProviderAPI";
import { ServicesGallerySkeleton } from "../../../skeletons/ServiceGallerySkeleton/ServicesGallerySkeleton";

/* ==========================================================================
 * COMPONENTE PRINCIPAL
 * ========================================================================== */
export default function ServiceGalleryZoom() {

  const [loading, setLoading] = useState<boolean>(false);

  const [services, setServices] = useState([
    {
    id: 1,
    title: "Design de Interface",
    description: "Criação de telas otimizadas com foco em UX e responsividade.",
    subcategory: "Subcategoria",
    category: "UI/UX",
    price: "R$500",
    duration: "2 dias",
    rating: 4.8,
    images: ["https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg", "/img/uiux2.jpg"],
  }
]);

  useEffect(() => {
    setLoading(true);

    const getServices = async () => {
      const token = localStorage.getItem("token");
      if(!token) return;

      const servicesList = await providerApi.getServices(token);

      if(!servicesList) return;

      if(Array.isArray(servicesList)) {
        const list = servicesList.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description_service,
          subcategory: e.subcategory,
          category: e.category ? e.category.name : "Categoria",
          price: e.price,
          duration: e.duration,
          rating: 3.2,
          images: [
            e.imageUrl,
            "/img/uiux2.jpg",
          ],
      }));

      setServices(list);

      }

      setLoading(false);

    }

    getServices();
  }, [])


  /* ------------------------------------------------------------------------
   * ESTADOS PRINCIPAIS
   * ------------------------------------------------------------------------ */
  const [searchTerm, setSearchTerm] = useState(""); // texto digitado na barra de busca
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc" | null>(null); // ordenação por preço
  const [minRating, setMinRating] = useState<number>(0); // nota mínima
  const [filtered, setFiltered] = useState(services); // lista filtrada
  const [isMobile, setIsMobile] = useState(false); // controle de largura da tela


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
  }, [searchTerm, priceOrder, minRating, services]);

  /* ==========================================================================
   * RENDERIZAÇÃO
   * ========================================================================== */
  return (
    <LayoutGroup>
      
      <div className="min-h-screen bg-[var(--bg-dark)] overflow-x-hidden text-[var(--text)]/80  px-6 md:px-20 transition-colors duration-300">
        {/* ------------------------------------------------------------------
         * CABEÇALHO
         * ------------------------------------------------------------------ */}
        <h1 className="text-6xl font-bold text-center pt-15 mb-10 ">
          Galeria de Serviços
        </h1>

        {/* ------------------------------------------------------------------
         * BARRA DE PESQUISA + TAGS + FILTROS
         * ------------------------------------------------------------------ */}
        <div className="flex flex-col items-center gap-3 mb-5">
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
              className="absolute right-4 top-4 text-[var(--text)]/60 hover:text-[var(--primary)]"
            >
              <X size={18} />
            </button>
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
        <div className="grid -ml-4 grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-16">
          {filtered.map((srv) => (
           
              <PostCard service={srv}/>
           
          ))}
        </div>

       
      </div>
      
    </LayoutGroup>
  );
}
