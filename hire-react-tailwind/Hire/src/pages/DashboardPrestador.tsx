import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { mockProvider } from "./ProfilePage";
import ProviderHero from "../components/ProviderHero/ProviderHero";
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
import ServiceEditor from "../components/ServiceEditor/ServiceEditor";

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
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=60&auto=format&fit=crop",
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

 

  // mobile accordion (drawer alternative per sua escolha 'b')
  const [panelOpen, setPanelOpen] = useState(false);

  
  /* fetch resources (with fallback mocks) */
  useEffect(() => {
    let mounted = true;
    async function load() {
     
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

     
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);  

  // UI motion variants
  const panelVariant = { closed: { height: 0, opacity: 0 }, open: { height: "auto", opacity: 1 } };
  const[openCreateService, setOpenCreateService]=useState(false)

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <LayoutGroup>
      <div className="min-h-screen bg-[var(--bg-dark)] pt-25 text-[var(--text)] px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* header */}        
        <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row gap-6">
          {/* aside (desktop) visible at right; on mobile it will be an accordion below header */}
          <ProviderHero provider={mockProvider}/>
          <aside className="w-full mt-6 lg:w-80">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className=" lg:block mb-4 bg-[var(--bg-light)]/40 backdrop-blur-xl rounded-2xl p-4 border border-[var(--border)] shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Atalhos</h3>
                <div className="text-xs text-[var(--text-muted)]">Acesso rápido</div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={()=>setOpenCreateService(true)} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--primary)]/90 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
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
                        <button onClick={()=>setOpenCreateService(true)} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--bg)]/40 border border-[var(--border-muted)] hover:border-[var(--highlight)]">
                          <Plus /> <span  className="text-sm">Novo serviço</span>
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
            <div >

            {openCreateService&&( <div className="fixed inset-0 z-20 "><ServiceEditor isOpen={openCreateService} onClose={() => setOpenCreateService(false)} /></div>)}
            </div>
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
          </aside>
        </div>

        {/* main content: services + bookings */}
        <div className="max-w-[90%] mx-auto grid gap-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* services list */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                
              </div>              
            </section>

            
          </div>
        </div>
      </div>

      
    </LayoutGroup>
  );
}


