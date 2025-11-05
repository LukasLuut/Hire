import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Star,
  Clock,
  DollarSign,
  Bell,
  Plus,
  MessageSquare,
  Archive,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ---------------------------
   Types & Mock data (same as antes)
   --------------------------- */
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
  active: boolean;
  createdAt: string;
};

type Booking = {
  id: number;
  serviceId: number;
  clientName: string;
  date: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  price: string;
};

type Review = {
  id: number;
  serviceId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    title: "Design de Interfaces Premium",
    shortDescription:
      "UI/UX para produtos digitais — protótipos interativos e guidelines.",
    description:
      "Design completo de interfaces, protótipos interativos, tests de usabilidade e guidelines. Inclui 2 rodadas de revisão e entregáveis prontos para dev.",
    category: "Design",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=60&auto=format&fit=crop",
    ],
    rating: 4.92,
    price: "R$ 2.400",
    duration: "7 dias",
    active: true,
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    title: "Desenvolvimento Web Fullstack",
    shortDescription: "Aplicações modernas com React/Node — deploy incl.",
    description:
      "Fullstack com React, Node, banco e deploy. Entrega com testes e documentação. Opção de suporte mensal.",
    category: "Tecnologia",
    images: [
      "https://images.unsplash.com/photo-1517148815978-75f6acaaff06?w=1400&q=60&auto=format&fit=crop",
    ],
    rating: 4.85,
    price: "R$ 5.000",
    duration: "14 dias",
    active: true,
    createdAt: "2025-07-15",
  },
  {
    id: 3,
    title: "Consultoria em Performance",
    shortDescription: "Diagnóstico e plano de otimização para apps.",
    description:
      "Auditoria, diagnóstico de verbosidade, recomendações e execução de melhorias de performance no front-end e infra.",
    category: "Consultoria",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=60&auto=format&fit=crop",
    ],
    rating: 4.78,
    price: "R$ 900",
    duration: "3 dias",
    active: false,
    createdAt: "2024-11-02",
  },
  {
    id: 4,
    title: "Consultoria em Performance",
    shortDescription: "Diagnóstico e plano de otimização para apps.",
    description:
      "Auditoria, diagnóstico de verbosidade, recomendações e execução de melhorias de performance no front-end e infra.",
    category: "Consultoria",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=60&auto=format&fit=crop",
    ],
    rating: 4.78,
    price: "R$ 900",
    duration: "3 dias",
    active: false,
    createdAt: "2024-11-02",
  },
  {
    id: 5,
    title: "Consultoria em Performance",
    shortDescription: "Diagnóstico e plano de otimização para apps.",
    description:
      "Auditoria, diagnóstico de verbosidade, recomendações e execução de melhorias de performance no front-end e infra.",
    category: "Consultoria",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=1400&q=60&auto=format&fit=crop",
    ],
    rating: 4.78,
    price: "R$ 900",
    duration: "3 dias",
    active: false,
    createdAt: "2024-11-02",
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 101,
    serviceId: 1,
    clientName: "João Silva",
    date: "2025-10-20T10:00:00Z",
    status: "scheduled",
    price: "R$ 2.400",
  },
  {
    id: 102,
    serviceId: 2,
    clientName: "Maria Oliveira",
    date: "2025-10-22T14:30:00Z",
    status: "in-progress",
    price: "R$ 5.000",
  },
  {
    id: 103,
    serviceId: 1,
    clientName: "Carlos Santos",
    date: "2025-09-30T09:00:00Z",
    status: "completed",
    price: "R$ 2.400",
  },
   {
    id: 104,
    serviceId: 1,
    clientName: "Carlos Santos",
    date: "2025-09-30T09:00:00Z",
    status: "completed",
    price: "R$ 2.400",
  },
   {
    id: 105,
    serviceId: 1,
    clientName: "Carlos Santos",
    date: "2025-09-30T09:00:00Z",
    status: "completed",
    price: "R$ 2.400",
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 201,
    serviceId: 1,
    author: "Ana",
    rating: 5,
    comment: "Trabalho impecável e muito atencioso no briefing.",
    date: "2025-10-02",
  },
  {
    id: 202,
    serviceId: 2,
    author: "Pedro",
    rating: 4.5,
    comment: "Entrega rápida e clara. Recomendo.",
    date: "2025-09-18",
  },
];

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 2200) =>
  new Promise<Response>((resolve, reject) => {
    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, timeout);
    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        clearTimeout(id);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });

/* ---------------------------
   Component
   --------------------------- */
export default function DashboardPrestador() {
  // data
  const [services, setServices] = useState<Service[] | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);

  // UI
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [sort, setSort] = useState<"newest" | "rating">("newest");
  const [showNotifications, setShowNotifications] = useState(false);

  // mobile accordion (drawer alternative per sua escolha 'b')
  const [panelOpen, setPanelOpen] = useState(false);

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  /* fetch resources (with fallback mocks) */
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchWithTimeout("/api/my/services");
        const data = await res.json();
        if (mounted) setServices(data);
      } catch {
        if (mounted) setServices(MOCK_SERVICES);
      }

      try {
        const res2 = await fetchWithTimeout("/api/my/bookings");
        const data2 = await res2.json();
        if (mounted) setBookings(data2);
      } catch {
        if (mounted) setBookings(MOCK_BOOKINGS);
      }

      try {
        const res3 = await fetchWithTimeout("/api/my/reviews");
        const data3 = await res3.json();
        if (mounted) setReviews(data3);
      } catch {
        if (mounted) setReviews(MOCK_REVIEWS);
      }

      if (mounted) setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // derived stats
  const totalServices = (services || MOCK_SERVICES).length;
  const activeBookings = (bookings || MOCK_BOOKINGS).filter((b) => b.status === "scheduled" || b.status === "in-progress")
    .length;
  const avgRating =
    ((reviews || MOCK_REVIEWS).reduce((s, r) => s + r.rating, 0) /
      ((reviews || MOCK_REVIEWS).length || 1)) || 0;
  const recentEarnings = (bookings || MOCK_BOOKINGS)
    .filter((b) => new Date(b.date) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)) // 60 days
    .reduce((sum, b) => sum + Number((b.price || "0").replace(/[^\d]/g, "")), 0);

  // filtered services
  const filteredServices = useMemo(() => {
    const list = (services || MOCK_SERVICES).filter((s) => {
      const matchesSearch =
        debouncedSearch.trim() === "" ||
        s.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesFilter =
        filterActive === "all" ? true : filterActive === "active" ? s.active : !s.active;
      return matchesSearch && matchesFilter;
    });

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [services, debouncedSearch, filterActive, sort]);

  // simple handlers
  function toggleActive(serviceId: number) {
    setServices((prev) => prev && prev.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s)));
  }

  function removeService(serviceId: number) {
    setServices((prev) => prev && prev.filter((s) => s.id !== serviceId));
  }

  // UI motion variants
  const statVariant = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };
  const cardVariant = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };
  const panelVariant = { closed: { height: 0, opacity: 0 }, open: { height: "auto", opacity: 1 } };

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <LayoutGroup>
      <div className="min-h-screen bg-[var(--bg)] pt-25 text-[var(--text)] px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* header */}
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row gap-6">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-[var(--bg-dark)]/40  backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-[var(--border)] shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=240&q=80&auto=format&fit=crop"
                  alt="Avatar"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[var(--highlight)] object-cover"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-lg md:text-2xl font-bold">Você — Vitor Reis</h1>
                    <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <Star className="text-yellow-400" />
                      <span className="font-semibold">{avgRating.toFixed(2)}</span>
                      <span>•</span>
                      <span>{(reviews || MOCK_REVIEWS).length} reviews</span>
                    </div>
                  </div>
                  <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base max-w-xl">
                    Painel do prestador — acompanhe suas reservas, avaliações e renda. Gerencie seus serviços e responda clientes rapidamente.
                  </p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  title="Notificações"
                  onClick={() => setShowNotifications((s) => !s)}
                  className="p-2 rounded-lg bg-[var(--bg-light)]/30 border border-[var(--border)]"
                >
                  <Bell />
                </button>
                <button title="Novo serviço" className="p-2 rounded-lg bg-[var(--primary)] text-white">
                  <Plus />
                </button>
              </div>
            </div>

            {/* stats - mobile: horizontal scroll, desktop: grid */}
            <div className="mt-4">
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-3">
                <motion.div variants={statVariant} initial="hidden" animate="visible" className="p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <div className="text-xs text-[var(--text-muted)]">Serviços</div>
                  <div className="text-lg md:text-xl font-semibold">{totalServices}</div>
                </motion.div>

                <motion.div variants={statVariant} initial="hidden" animate="visible" className="p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <div className="text-xs text-[var(--text-muted)]">Reservas Ativas</div>
                  <div className="text-lg md:text-xl font-semibold">{activeBookings}</div>
                </motion.div>

                <motion.div variants={statVariant} initial="hidden" animate="visible" className="p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <div className="text-xs text-[var(--text-muted)]">Avaliação média</div>
                  <div className="text-lg md:text-xl font-semibold flex items-center gap-2"><Star className="text-yellow-400" />{avgRating.toFixed(2)}</div>
                </motion.div>

                <motion.div variants={statVariant} initial="hidden" animate="visible" className="p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                  <div className="text-xs text-[var(--text-muted)]">Receita (60d)</div>
                  <div className="text-lg md:text-xl font-semibold flex items-center gap-2"><DollarSign />R$ {Math.round(recentEarnings).toLocaleString()}</div>
                </motion.div>
              </div>

              {/* mobile horizontal scroll */}
              <div className="sm:hidden mt-3 overflow-x-auto">
                <div className="flex gap-3">
                  <motion.div className="min-w-[140px] p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                    <div className="text-xs text-[var(--text-muted)]">Serviços</div>
                    <div className="text-lg font-semibold">{totalServices}</div>
                  </motion.div>
                  <motion.div className="min-w-[160px] p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                    <div className="text-xs text-[var(--text-muted)]">Reservas</div>
                    <div className="text-lg font-semibold">{activeBookings}</div>
                  </motion.div>
                  <motion.div className="min-w-[160px] p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                    <div className="text-xs text-[var(--text-muted)]">Avaliação</div>
                    <div className="text-lg font-semibold flex items-center gap-2"><Star className="text-yellow-400" />{avgRating.toFixed(2)}</div>
                  </motion.div>
                  <motion.div className="min-w-[180px] p-3 rounded-xl bg-[var(--bg-light)]/30 border border-[var(--border-muted)]">
                    <div className="text-xs text-[var(--text-muted)]">Receita (60d)</div>
                    <div className="text-lg font-semibold flex items-center gap-2"><DollarSign />R$ {Math.round(recentEarnings).toLocaleString()}</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.header>

          {/* aside (desktop) visible at right; on mobile it will be an accordion below header */}
          <aside className="w-full lg:w-80">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block bg-[var(--bg-light)]/40 backdrop-blur-xl rounded-2xl p-4 border border-[var(--border)] shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Atalhos</h3>
                <div className="text-xs text-[var(--text-muted)]">Acesso rápido</div>
              </div>

              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--primary)]/90 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                  <Plus /> <span className="text-sm">Novo serviço</span>
                </button>
                <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                  <MessageSquare /> <span className="text-sm">Mensagens</span>
                </button>
                <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                  <Archive /> <span className="text-sm">Relatórios</span>
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Notificações recentes</h4>
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-[var(--text-muted)]">• Nova avaliação recebida — Ana (5★)</div>
                  <div className="text-xs text-[var(--text-muted)]">• Reserva confirmada — João (20/10)</div>
                </div>
              </div>
            </motion.div>

            {/* mobile accordion panel (option b) */}
            <div className="lg:hidden mt-4">
              <motion.button
                onClick={() => setPanelOpen((s) => !s)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-[var(--bg-light)]/30 border border-[var(--border)]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[var(--bg)]/40 border border-[var(--border-muted)]">
                    <Plus />
                  </div>
                  <div>
                    <div className="font-medium">Atalhos & Notificações</div>
                    <div className="text-xs text-[var(--text-muted)]">Abrir painel rápido</div>
                  </div>
                </div>

                <div className="text-[var(--text-muted)]">
                  {panelOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </motion.button>

              <AnimatePresence>
                {panelOpen && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={panelVariant}
                    transition={{ duration: 0.28 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="p-4 rounded-2xl bg-[var(--bg-light)]/30 border border-[var(--border)]">
                      <div className="flex flex-col gap-3">
                        <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                          <Plus /> <span className="text-sm">Novo serviço</span>
                        </button>
                        <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                          <MessageSquare /> <span className="text-sm">Mensagens</span>
                        </button>
                        <button className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                          <Archive /> <span className="text-sm">Relatórios</span>
                        </button>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Notificações recentes</h4>
                        <div className="flex flex-col gap-2 text-xs text-[var(--text-muted)]">
                          <div>• Nova avaliação recebida — Ana (5★)</div>
                          <div>• Reserva confirmada — João (20/10)</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>
        </div>

        {/* main content: services + bookings */}
        <div className="max-w-[90%] mx-auto grid gap-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* services list */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Seus serviços</h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar entre seus serviços..."
                    className="px-3 py-2 rounded-full bg-[var(--bg-light)]/20 border border-[var(--border-muted)] outline-none text-[var(--text)] w-full sm:w-72"
                  />

                  <select value={filterActive} onChange={(e) => setFilterActive(e.target.value as any)} className="px-2 py-2 rounded-full bg-[var(--bg-light)]/20 border border-[var(--border-muted)]">
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                  </select>

                  <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="px-2 py-2 rounded-full bg-[var(--bg-light)]/20 border border-[var(--border-muted)]">
                    <option value="newest">Mais novos</option>
                    <option value="rating">Melhor avaliação</option>
                  </select>
                </div>
              </div>

              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading &&
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden bg-[var(--bg-light)]/10 border border-[var(--border)] p-0">
                      <div className="w-full h-40 bg-[rgba(255,255,255,0.02)] animate-pulse" />
                      <div className="p-4">
                        <div className="h-4 bg-[rgba(255,255,255,0.02)] w-2/3 mb-2 animate-pulse rounded" />
                        <div className="h-3 bg-[rgba(255,255,255,0.02)] w-1/2 animate-pulse rounded" />
                      </div>
                    </motion.div>
                  ))}

                {!loading &&
                  filteredServices.map((s) => (
                    <motion.article
                      key={s.id}
                      layout
                      variants={cardVariant}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ y: -6, boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}
                      className="relative rounded-2xl  overflow-hidden bg-[linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02))] border border-[var(--border)]"
                    >
                      <div className="relative ">
                        <img src={s.images[0]} alt={s.title} className="w-full h-44 object-cover" />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[var(--bg)]/50 backdrop-blur-md border border-[var(--border-muted)] text-xs">
                          {s.category}
                        </div>
                        <div className="absolute right-3 top-3 flex gap-2">
                          <button
                            title={s.active ? "Desativar" : "Ativar"}
                            onClick={() => toggleActive(s.id)}
                            className={`p-2 rounded-full bg-[var(--bg)]/40 border border-[var(--border)]`}
                          >
                            {s.active ? "✓" : "•"}
                          </button>
                          <button onClick={() => setSelectedService(s)} title="Abrir" className="p-2 rounded-full bg-[var(--bg)]/40 border border-[var(--border)]">
                            <Star />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 ">
                        <h3 className="font-semibold text-lg">{s.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">{s.shortDescription}</p>

                        <div className="mt-4  flex items-end justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[var(--bg-light)]/20 px-2 py-1 rounded-md border border-[var(--border-muted)]">
                              <Star className="text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">{s.rating.toFixed(1)}</span>
                            </div>
                            <div className="text-sm  text-[var(--text-muted)] flex items-center gap-2">
                              <Clock /> {s.duration}
                            </div>
                          </div>

                          <div className="text-right ">
                            <div className="text-[var(--text-muted)] font-semibold">{s.price}</div>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => setSelectedService(s)} className="px-3 py-1 text-xs rounded-full bg-[var(--primary)]/90 text-white border border-[var(--border)]">Detalhes</button>
                              <button onClick={() => removeService(s.id)} className="px-3 py-1 text-xs rounded-full bg-[var(--bg)]/30 border border-red-600 text-red-400">Remover</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
              </motion.div>
            </section>

            {/* right column inside main (bookings + reviews) */}
            <aside className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--bg-light)]/30 backdrop-blur-xl rounded-2xl p-4 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Reservas recentes</h4>
                  <div className="text-xs text-[var(--text-muted)]">Próximas</div>
                </div>

                <div className="flex flex-col gap-3">
                  {(bookings || MOCK_BOOKINGS).slice(0, 4).map((b) => {
                    const svc = (services || MOCK_SERVICES).find((s) => s.id === b.serviceId);
                    return (
                      <div key={b.id} className="flex items-start gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)]">
                        <div className="w-10 h-10 rounded-md overflow-hidden">
                          <img src={svc?.images[0]} alt={svc?.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{b.clientName}</div>
                          <div className="text-[var(--text-muted)] text-xs">{new Date(b.date).toLocaleString()}</div>
                          <div className="text-xs mt-1">{svc?.title}</div>
                        </div>
                        <div className="text-right text-xs">
                          <div className="font-semibold">{b.price}</div>
                          <div className="text-[var(--text-muted)]">{b.status}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <button className="w-full px-3 py-2 rounded-lg bg-[var(--primary)] text-white font-semibold">Ver todas reservas</button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-[var(--bg-light)]/30 backdrop-blur-xl rounded-2xl p-4 border border-[var(--border)]">
                <div className="flex items-center justify-between mb-3"> 
                  <h4 className="font-semibold">Avaliações recentes</h4>
                  <div className="text-xs text-[var(--text-muted)]">Últimas</div>
                </div>

                <div className="flex flex-col  gap-3">
                  {(reviews || MOCK_REVIEWS).slice(0, 3).map((r) => (
                    <div key={r.id} className="p-3 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)]">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{r.author}</div>
                        <div className="text-yellow-400 text-sm"><Star size={14} /> {r.rating.toFixed(1)}</div>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-2">{r.comment}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </aside>
          </div>
        </div>
      </div>

      {/* details modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ backdropFilter: "blur(6px)" }} onClick={() => setSelectedService(null)}>
            <motion.div layoutId={`svc-${selectedService.id}`} onClick={(e) => e.stopPropagation()} className="w-full max-w-md sm:max-w-3xl rounded-3xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] shadow-2xl" initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}>
              <div className="relative">
                <img src={selectedService.images[0]} alt={selectedService.title} className="w-full h-56 sm:h-64 object-cover" />
                <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 bg-black/40 rounded-full p-2"><X /></button>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl text-[var(--text)] font-bold">{selectedService.title}</h3>
                <p className="text-[var(--text-muted)] mt-2 text-sm sm:text-base">{selectedService.description}</p>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 bg-[var(--bg-light)]/20 px-3 py-1 rounded-md border border-[var(--border-muted)]">
                    <Star className="text-yellow-400" /> <strong className="text-[var(--text)]">{selectedService.rating.toFixed(2)}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <Clock /> {selectedService.duration}
                  </div>

                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <DollarSign /> {selectedService.price}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button className="px-4 py-2 rounded-2xl bg-[var(--primary)] text-white font-semibold">Editar serviço</button>
                  <button className="px-4 py-2 rounded-2xl border text-[var(--text)] border-[var(--border)]">Ver perfil público</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/* -------------------------------------
   Helpers
   ------------------------------------- */
function filteredLengthLabel(filtered: Service[] | null) {
  if (!filtered) return "—";
  return `${filtered.length} resultados`;
}
