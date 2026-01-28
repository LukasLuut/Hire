// service_progress_full.tsx
// -------------------------
// Componente completo e tipado em TypeScript para Acompanhamento de Serviço
// - Versões: Prestador (Provider) e Contratante (Client)
// - Responsivo (mobile -> desktop)
// - Mock de dados para teste
// - Comentários educativos organizados em seções para um estagiário
// - Usa variáveis CSS do projeto: --bg, --bg-light, --border, --text, --primary, --highlight

import { CheckCircle, User } from "lucide-react";
import PostCard from "./ServiceGallery/Service/Service";
import { ServiceProgressSkeleton } from "../skeletons/ServiceProgressSkeleton/ServiceProgressSkeleton";
import { useEffect, useState } from "react";

/* -----------------------------
   Tipagens (Types) - fácil leitura
   ----------------------------- */
export type StepId =
  | "created"
  | "accepted"
  | "started"
  | "in_progress"
  | "review"
  | "done";

export type Step = {
  id: StepId;
  label: string;
  date?: string; // ISO date opcional
};

export type UserBadgeData = {
  id: string;
  name: string;
  role?: string; // e.g. "Prestador" / "Contratante"
  avatar?: string | null; // URL ou null
};

export type ServiceDetails = {
  orderId: string;
  title: string;
  price: number; // em centavos ou reais conforme sua preferência
  deadline: string; // texto amigável (ex: "3 dias")
  rating: number; // ex: 4.9
  paymentMethod: string;
};

export type UpdateItem = {
  id: string;
  title: string;
  description?: string;
  date?: string; // ISO
};

export type ServiceProgressProps = {
  // dados principais
  steps: Step[];
  currentStep: StepId;
  // profile: qual view renderizar: "provider" | "client" (comportamentos/ações diferentes)
  data: any;
  viewFor: "provider" | "client";
  // callbacks (em app real substituir por handlers)
  onAction?: (action: number) => void;
  onBegin: (id: number) => void;
  onMessage?: () => void;
};

/* -----------------------------
   Helpers utilitários
   ----------------------------- */

function stepsIndex(steps: Step[]) {
  const map: Record<StepId, number> = {
    created: 0,
    accepted: 1,
    started: 2,
    in_progress: 3,
    review: 4,
    done: 5,
  };
  // retorna a menor posição válida encontrada na lista de steps
  return (id: StepId) => Math.max(0, Math.min(5, map[id] ?? 0));
}

/* -----------------------------
   Componente principal: ServiceProgress
   - Responsivo: usa grid que vira coluna em mobile
   - Anotações para estagiário explicando cada parte
   ----------------------------- */
export function ServiceProgress({
  steps,
  currentStep,
  viewFor,
  data,
  onAction,
  onBegin
}: ServiceProgressProps) {
  const idxOf = stepsIndex(steps);
  const currentIndex = idxOf(currentStep);  
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if(loading) {
    return <ServiceProgressSkeleton />
  }

  return (
    <div
      className="w-full h-full p-6 mt-20 border-1 border-[var(--border)] md:p-10 bg-[var(--bg-light)] rounded-2xl text-[var(--text)] shadow-lg hover:shadow-[0_0_25px_-5px_var(--primary)/20]"
      role="region"
      aria-labelledby="service-progress-title"
    >
      <div className="flex flex-col md:flex-row md:justify-between">
        <div>
          {/* HEADER ------------------------------------------------------ */}
          <header
            className="flex flex-col  md:flex-row md:mt-10 max-w-150 md:items-start md:justify-between gap-4"
            aria-live="polite"
          >
            <div >
              <h1 id="service-progress-title" className="text-3xl  md:text-4xl font-bold">
                {data.service.title}
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Nº do pedido: 000{data.id}
              </p>
            </div>


          </header>

          {/* GRID LAYOUT ------------------------------------------------ */}

          <div className="">

            <main className="lg:col-span-2 md:w-100">
              {/* USERS --------------------------------------------------- */}
              <div
                className="flex items-center gap-6 mb-6 mt-8"
                role="group"
                aria-label="Prestador e contratante"
              >
                <UserBadge name={data.provider.professionalName} role="Prestador" />
                <span className="text-sm text-[var(--text-muted)]">—</span>
                <UserBadge name={data.user.name} role="Cliente" />
              </div>

              {/* TIMELINE ------------------------------------------------ */}
              <section aria-labelledby="timeline-title" className="mb-6">
                <h2 id="timeline-title" className="sr-only">
                  Linha do tempo do serviço
                </h2>

                <div
                  className="flex gap-4 items-center overflow-x-auto py-3"
                  role="list"
                >
                  {steps.map((s, i) => {
                    const completed = i <= currentIndex;
                    const isCurrent = i === currentIndex;

                    return (
                      <div
                        key={s.id}
                        role="listitem"
                        aria-label={`Etapa: ${s.label} ${completed ? "(concluída)" : "(pendente)"
                          }`}
                        aria-current={isCurrent ? "step" : undefined}
                        className="flex flex-col items-center min-w-[120px]"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${completed ? "bg-[var(--primary)] border-[var(--primary)]" : "bg-[var(--bg-light)] border-[var(--border)]"}`}
                        >
                          {completed ? (
                            <CheckCircle size={16} className="text-white" aria-hidden />
                          ) : (
                            <div
                              className={`w-2.5 h-2.5 rounded-full ${completed ? "bg-white" : "bg-[var(--border)]"}`}
                              aria-hidden
                            />
                          )}
                        </div>

                        <p className="text-sm font-semibold text-center mt-3 text-[var(--text)]">
                          {s.label}
                        </p>
                        {s.date && (
                          <p className="text-[var(--text-muted)] text-xs mt-1">
                            {s.date}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ACTIONS ------------------------------------------------- */}
              <section aria-labelledby="actions-title" className="mb-6">
                <h2 id="actions-title" className="text-lg font-semibold mb-3">
                  Ações
                </h2>

                <div
                  role="group"
                  aria-labelledby="actions-title"
                  className="flex flex-col sm:flex-row gap-3"
                >
                  {viewFor === "provider" ? (
                    <>
                      <button
                        className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-dark)]
                  hover:bg-[var(--primary)] hover:text-white transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label="Iniciar serviço"
                        onClick={() => onBegin?.(data.id)}
                      >
                        Iniciar serviço
                      </button>



                      <button
                        className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-dark)]
                  hover:bg-[var(--primary)] hover:text-white transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label="Marcar serviço como concluído"
                        onClick={() => onAction?.(data.id)}
                      >
                        Marcar como concluído
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-light)]
                  hover:bg-[var(--primary)] hover:text-white transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label="Confirmar início do serviço"
                        onClick={() => onAction?.(data.id)}
                      >
                        Confirmar início
                      </button>


                      <button
                        className="px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-light)]
                  hover:bg-[var(--primary)] hover:text-white transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label="Solicitar alteração no serviço"
                        onClick={() => onAction?.(data.id)}
                      >
                        Solicitar alteração
                      </button>
                    </>
                  )}
                </div>
              </section>
            </main>

          </div>



        </div>
        {/* SIDEBAR -------------------------------------------------- */}
        <aside className="flex relative  flex-col items-end " aria-label="Detalhes do serviço">
          <PostCard service={{
            id: data.service.id,
            title: data.service.title,
            description: data.service.description_service,
            category: data.service.category.name,
            price: data.service.price,
            negotiable: data.service.negotiable,
            subcategory: data.service.subcategory,
            duration: data.service.duration,
            images: [data.service.imageUrl]
          }} 
          noEdit={true} />

        </aside>
      </div>
    </div>
  );
}

/* -----------------------------
   Subcomponentes pequenos: UserBadge
   - Componentização melhora organização e facilita testes unitários
   ----------------------------- */
function UserBadge(user: { name: string, role: string}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--bg-light)] border border-[var(--border)] flex items-center justify-center">
          <User className="w-6 h-6 text-[var(--primary)]" />        
      </div>
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-xs text-[var(--text-muted)]">{user.role}</div>
      </div>
    </div>
  );
}

/* -----------------------------
   MOCKS e Export de Demonstração
   - Fornece dados prontos para testes locais
   - Fácil para o estagiário entender e alterar
   ----------------------------- */