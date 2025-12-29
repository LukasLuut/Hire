import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  HandCoins,
} from "lucide-react";
import { serviceAPI, type ServiceData } from "../api/ServiceAPI";
import { categoryAPI } from "../api/CategoryAPI";
import { LOCAL_PORT } from "../api/ApiClient";
import ServiceDetail from "../components/ServiceGallery/ServiceDetail/ServiceDetail";
import { ServicesPageSkeleton } from "../skeletons/ServiceSkeleton/ServicesPageSkeleton";

/**
 * ServiceDashboardSophisticated.tsx
 *
 * Requisitos:
 *  - Tailwind CSS + suas variáveis de tema (--bg, --bg-light, --highlight, etc.)
 *  - Framer Motion
 *  - Lucide icons
 *
 * Observação: este componente tenta buscar dados via fetch e cai em mock se houver falha/timeout.
 */

type Service = {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  images: string[];
  rating: number;
  price: string;
  duration: string;
  location?: string;
  provider?: {
    professionalName?: string;
    profileImageUrl?: string;
    description?: string;
    id: number;
  };
};

type Provider = {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  specialty: string;
};

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: "Design de Interfaces Premium",
    shortDescription:
      "UI/UX para produtos digitais com entrega aposta e protótipos",
    description:
      "Design completo de interfaces, protótipos interativos e guidelines de estilo. Inclui 2 rodadas de revisão e entrega em Figma/Sketch.",
    category: "Design",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.92,
    price: "R$ 2.400",
    duration: "7 dias",
    location: "Remoto",
  },
  {
    id: 2,
    title: "Desenvolvimento Web Fullstack",
    shortDescription: "Apps modernos com React, Node e deploy completo",
    description:
      "Desenvolvimento de aplicações web com API, autenticação, e painel administrativo. Entrega com testes e documentação.",
    category: "Tecnologia",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526378725139-7a9d8f08b20f?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.85,
    price: "R$ 5.000",
    duration: "14 dias",
    location: "Remoto / Presencial (SP)",
  },
  {
    id: 3,
    title: "Serviço de Pintura de Interiores",
    shortDescription: "Pintura profissional com tinta premium e limpeza final",
    description:
      "Pintura de cômodos, preparação de superfícies e acabamento de alta qualidade. Orçamento por m².",
    category: "Construção",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.7,
    price: "R$ 350 / cômodo",
    duration: "1–3 dias",
    location: "Presencial",
  },
  {
    id: 4,
    title: "Limpeza Profissional Residencial",
    shortDescription: "Limpeza profunda com produtos eco-friendly",
    description:
      "Limpeza completa de residências, incluindo higienização de estofados e remoção de manchas. Equipe treinada.",
    category: "Serviços",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.65,
    price: "R$ 180",
    duration: "3 horas",
    location: "Presencial",
  },
];

const MOCK_PROVIDERS: Provider[] = [
  {
    id: 1,
    name: "Alexandre Reis",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&q=80&auto=format&fit=crop",
    rating: 4.95,
    specialty: "Desenvolvimento Web",
  },
  {
    id: 2,
    name: "Carla Dias",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop",
    rating: 4.87,
    specialty: "Design Gráfico",
  },
  {
    id: 3,
    name: "Lucas Andrade",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop",
    rating: 4.82,
    specialty: "Manutenção",
  },
  {
    id: 4,
    name: "Fernanda Costa",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop",
    rating: 4.78,
    specialty: "Fotografia",
  },
];

const fetchWithTimeout = (
  url: string,
  options: RequestInit = {},
  timeout = 2500
) =>
  new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, timeout);
    fetch(url, { ...options, signal: controller.signal })
      .then((r) => {
        clearTimeout(id);
        resolve(r);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });

export default function ServiceDashboardSophisticated() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [providers, setProviders] = useState<Provider[] | null>(null);

  // search + filters
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "price">(
    "relevance"
  );

  // UI state
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [page, setPage] = useState(1);

  // small debounce for search
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // fetch data with fallback to mock
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const data = await serviceAPI.getServices();
        if (!data) throw new Error();

        if (Array.isArray(data)) {
          const list: Service[] = data.map((e) => {
            const image = LOCAL_PORT + e.imageUrl;

            return {
              id: e.id,
              title: e.title,
              shortDescription: e.description_service,
              description: e.description_service,
              subcategory: e.subcategory,
              category: e.category.name,
              price: String(e.price),
              active: true,
              duration: e.duration,
              rating: 4.6,
              images: [image],
              provider: e.provider
                ? {
                    id: e.provider.id,
                    professionalName: e.provider.professionalName,
                    profileImageUrl: e.provider.profileImageUrl,
                    description: e.provider.description,
                  }
                : undefined,
            };
          });

          setServices(list);
        }
      } catch {
        if (mounted) setServices(MOCK_SERVICES);
      }

      try {
        const provRes = await fetchWithTimeout("/api/providers");
        const provData = await provRes.json();
        if (!mounted) return;
        setProviders(provData);
      } catch {
        setProviders(MOCK_PROVIDERS);
      } finally {
    
        setTimeout(() => {
          setLoading(false);
        }, 1000)
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // derived categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    (services || MOCK_SERVICES).forEach((s) => cats.add(s.category));
    return ["Todos", ...Array.from(cats)];
  }, [services]);

  // filtering + sorting
  const filtered = useMemo(() => {
    const list = (services || MOCK_SERVICES).filter((s) => {
      const matchesQuery =
        debouncedQuery.trim() === "" ||
        s.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "Todos" || s.category === categoryFilter;
      const matchesRating = s.rating >= minRating;
      return matchesQuery && matchesCategory && matchesRating;
    });

    if (sortBy === "rating") return list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "price") {
      // crude price sorting by extracting digits
      const extract = (p: string) => Number(p.replace(/[^\d]/g, "")) || 0;
      return list.sort((a, b) => extract(a.price) - extract(b.price));
    }
    // relevance fallback
    return list;
  }, [services, debouncedQuery, categoryFilter, minRating, sortBy]);

  // pagination (simple)
  const pageSize = 8;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const skeletons = Array.from({ length: 8 }).map((_, i) => i);

  const [open, setOpen] = useState(false);

  const handleDetail = () => {
    setOpen(true);
  };

  if(loading) {
    return <ServicesPageSkeleton/>
  }

  return (
    <LayoutGroup>
      <h1 className="mt-10 mb-5 text-4xl px-12 font-bold leading-tight">
        Busque e pesquise pelos melhores serviços.
      </h1>
      <h3 className=" md:flex hidden px-12 leading-tight">
        Escolha o tipo de serviço e encontre profissionais disponíveis. Filtre
        por categoria, avaliação e preço.
      </h3>
      <div className="min-h-screen bg-[var(--bg-dark)] md:min-w-screen text-[var(--text)] p-6 md:p-10 ">
        {/* Floating Search + Filters (sophisticated) */}
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="max-w-7xl mx-auto grid gap-4"
        >
          <div className="relative ">
            <div
              className="absolute top-6 left-1/2 -translate-x-1/2 w-full md:w-[90%] lg:w-full"
              aria-hidden
            />
            <div className="flex flex-col mb-10 md:flex-row items-stretch gap-4">
              {/* search box */}
              <div className="flex-1 relative">
                <div
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[linear-gradient(90deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-[var(--border-muted)] shadow-lg"
                  role="search"
                >
                  <Search className=" text-[var(--text-muted)]" />
                  <input
                    aria-label="Buscar serviços"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Procure por serviços, habilidades ou palavras-chave..."
                    className="bg-transparent outline-none text-[var(--text)] placeholder:[var(--text-muted)] flex-1"
                  />
                </div>
                {/* subtle suggestion chips */}
                <div className="lg:absolute  mt-2 flex gap-2 flex-wrap">
                  {["design", "react", "limpeza", "pintura"].map((chip) => (
                    <motion.button
                      key={chip}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => setQuery(chip)}
                      className="text-xs px-3 py-1 rounded-full bg-[var(--bg-light)]/30 border border-[var(--border-muted)] text-[var(--text-muted)]"
                    >
                      #{chip}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* filters */}
              <div className="flex items-center  gap-3">
                <div className="hidden md:flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <Filter className="text-[var(--text-muted)]" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[var(--bg)] outline-none text-[var(--text)]"
                    aria-label="Filtrar por categoria"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="hidden md:flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <Star fill="currentColor" className="text-yellow-400" />
                  <input
                    aria-label="Avaliação mínima"
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="accent-[var(--highlight)]"
                  />
                </div>

                <div className="hidden md:flex items-center gap-2 p-2 rounded-2xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[var(--bg)] outline-none text-[var(--text)]"
                    aria-label="Ordenar por"
                  >
                    <option value="relevance">Relevância</option>
                    <option value="rating">Avaliação</option>
                    <option value="price">Preço</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* main content area */}
        <div className="  max-w-full sm:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:mt-8">
          {/* SERVICES GRID */}
          <section className="relative ">
            <div className="flex items-baseline  justify-between mb-4">
              <div className="">
                <h2 className="text-2xl font-semibold">Explorar serviços</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Resultado:{" "}
                  <strong className="text-[var(--text-muted)]">
                    {filteredLengthLabel(filtered)}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPage(1);
                    setSortBy(sortBy === "rating" ? "relevance" : "rating");
                  }}
                  className="px-3 py-1 text-sm rounded-full bg-[var(--bg-light)]/30 border border-[var(--border-muted)]"
                >
                  Alternar ordenação
                </button>
                <div className="text-xs text-[var(--text-muted)]">
                  Página {page}/{totalPages}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-2 rounded-lg bg-[var(--bg-light)]/20 border border-[var(--border-muted)]"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg bg-[var(--bg-light)]/20 border border-[var(--border-muted)]"
                    aria-label="Próxima página"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* grid */}
            <motion.div
              className="grid grid-cols-1 mt-10 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
            >
              {loading &&
                skeletons.map((i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-[rgba(255,255,255,0.02)] border border-[var(--border)] p-0"
                  >
                    <div className="w-full h-40 bg-[linear-gradient(90deg,#0000,#0000)] animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 bg-[rgba(255,255,255,0.03)] rounded w-2/3 mb-2 animate-pulse" />
                      <div className="h-3 bg-[rgba(255,255,255,0.02)] rounded w-1/2 mb-4 animate-pulse" />
                      <div className="h-3 bg-[rgba(255,255,255,0.02)] rounded w-1/4 animate-pulse" />
                    </div>
                  </motion.div>
                ))}

              {!loading &&
                paged.map((srv) => (
                  <motion.article
                    key={srv.id}
                    layout
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{
                      y: -6,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                    }}
                    className="relative rounded-2xl overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.01), rgba(255,255,255,0.015))] border border-[var(--border)] shadow-[0_6px_18px_rgba(0,0,0,0.3)]"
                  >
                    <div className="relative">
                      <img
                        src={srv.images[0]}
                        alt={srv.title}
                        className="w-full h-48 object-cover transition-transform duration-400"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[var(--bg)]/50 backdrop-blur-md border border-[var(--border-muted)] text-xs">
                        {srv.category}
                      </div>
                    </div>

                    <div className="p-3">
                      {srv.provider && (
                        <motion.div
                          key={srv.provider.id}
                          className="flex items-center cursor-pointer gap-3 py-4 px-2 mb-2 border-b-1 border-t-1 rounded-lg bg-[var(--bg-dark)] border-[var(--highlight)]/50 transition"
                          whileHover={{ scale: 1.02 }}
                        >
                          <img
                            src={
                              srv.provider.profileImageUrl
                              ? `${LOCAL_PORT}${srv.provider.profileImageUrl}`
                              : 'https://api.dicebear.com/9.x/miniavs/svg?seed=vitorreis'
                            }
                            alt={srv.provider.professionalName}
                            className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">
                                {srv.provider.professionalName}
                              </div>
                              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                                <Star fill="currentColor" size={14} />
                                4.8
                              </div>
                            </div>
                            <div className="text-xs text-[var(--text-muted)] mt-1">
                              {srv.provider.description}
                            </div>
                            {/* <button className="mt-2 text-xs px-3 py-1 rounded-full bg-[var(--bg)]/60 border border-[var(--border)]">
                              Ver perfil
                            </button> */}
                          </div>
                        </motion.div>
                      )}

                      <h3 className="text-lg font-semibold leading-tight">
                        {srv.title}
                      </h3>

                      <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">
                        {srv.shortDescription}
                      </p>
                      <div className=" mt-4 flex items-center mb-2 text-[var(--highlight)] font-semibold">
                         <HandCoins size={20} className="text-[var(--text)]/70 mr-2" />
                        R$ {srv.price}
                      </div>
                      <div className=" flex items-center  justify-between">
                        <div className="flex items-center  gap-3">
                          
                          <div className="flex items-center mb-2 text-[var(--highlight)] font-semibold">
                            <Clock className="text-[var(--text)]/70 mr-2"  size={20} /> <span>{srv.duration}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <button
                            onClick={() => {
                              setSelectedService(srv);
                              handleDetail();
                            }}
                            className="mt-2 mb-2 mr-2 text-xs px-3 py-1 rounded-full bg-[var(--primary)] text-white font-medium hover:brightness-95 transition"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}

              {/* empty state */}
              {!loading && filtered.length === 0 && (
                <div className="col-span-full text-center py-20 text-[var(--text-muted)]">
                  Nenhum serviço encontrado para sua busca.
                </div>
              )}
            </motion.div>
          </section>

          {/* RIGHT SIDEBAR (Top Providers) */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-80 bg-[var(--bg-light)]/40 backdrop-blur-xl rounded-2xl p-4 border border-[var(--border)] shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Top Prestadores</h4>
                <div className="text-xs text-[var(--text-muted)]">Hoje</div>
              </div>

              <div className="flex flex-col gap-3">
                {(providers || MOCK_PROVIDERS).map((p) => (
                  <motion.div
                    key={p.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)] border border-[var(--border-muted)] hover:border-[var(--highlight)] transition"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{p.name}</div>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm">
                          <Star fill="currentColor" size={14} /> {p.rating.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        {p.specialty}
                      </div>
                      <button className="mt-2 text-xs px-3 py-1 rounded-full bg-[var(--bg)]/60 border border-[var(--border)]">
                        Ver perfil
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </aside>

          {/* mobile providers carousel */}
          <div className="lg:hidden mt-6">
            <h4 className="text-sm font-semibold mb-3">Top Prestadores</h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {(providers || MOCK_PROVIDERS).map((p) => (
                <motion.div
                  key={p.id}
                  className="min-w-[200px] flex-shrink-0 rounded-2xl p-3 bg-[var(--bg-light)]/30 border border-[var(--border)]"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {p.specialty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star fill="currentColor" size={14} /> {p.rating.toFixed(2)}
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full bg-[var(--highlight)] text-black">
                      Ver perfil
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetail
            service={selectedService}
            images={selectedService.images}
            isOpen={open}
            onClose={() => {
              setOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/* small helper for filtered count label */
function filteredLengthLabel(filtered: Service[] | null) {
  if (!filtered) return "—";
  return `${filtered.length} resultados`;
}
