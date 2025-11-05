import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  PenTool,
  ShieldCheck,
  Upload,
} from "lucide-react";

/*
  NegotiationFlow.tsx
  -------------------
  - Um componente completo do fluxo de contratação 
  - Contém 4 etapas: Preview -> Negociação -> Resumo -> Confirmação.
 
*/

type Party = {
  id: "provider" | "client";
  name: string;
  title?: string;
  rating?: number;
};

type Message = {
  id: string;
  sender: "provider" | "client" | "system";
  text: string;
  time: string;
};

type AgreementCard = {
  key: string;
  title: string;
  value: string;
  status: "agreed" | "pending" | "proposed";
};

const mockService = {
  id: "svc-01",
  title: "Desenvolvimento de Site Institucional",
  short: "Site institucional responsivo + SEO técnico básico",
  basePrice: "R$ 3.200,00",
  baseDays: 14,
  provider: {
    id: "provider",
    name: "Alexandre Reis",
    title: "Desenvolvedor Front-end Sênior",
    rating: 4.9,
  },
};

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function NegotiationFlow() {
  const [step, setStep] = useState(0); // 0..3

  const [provider] = useState<Party>({
    id: "provider",
    name: mockService.provider.name,
    title: mockService.provider.title,
    rating: mockService.provider.rating,
  });

  const [client] = useState<Party>({ id: "client", name: "Lucas William", title: "Cliente" });

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "provider", text: "Olá! Posso te ajudar com esse site institucional. O escopo base inclui design responsivo e SEO técnico.", time: "09:00" },
    { id: "m2", sender: "client", text: "Ótimo — eu gostaria de incluir integração com formulário e prazo de 10 dias.", time: "09:02" },
  ]);

  const [cards, setCards] = useState<AgreementCard[]>([
    { key: "service", title: "Serviço", value: mockService.short, status: "agreed" },
    { key: "price", title: "Valor", value: mockService.basePrice, status: "proposed" },
    { key: "deadline", title: "Prazo", value: `${mockService.baseDays} dias úteis`, status: "proposed" },
    { key: "payment", title: "Pagamento", value: "50% adiantamento · 50% na entrega", status: "agreed" },
  ]);

  
  const [editing, setEditing] = useState<{ key: string | null; value: string } | null>(null);
  const [signed, setSigned] = useState<{ provider: boolean; client: boolean }>({ provider: false, client: false });

  const progress = useMemo(() => Math.round(((step + 1) / 4) * 100), [step]);

  function addMessage(sender: Message["sender"], text: string) {
    const m: Message = { id: Math.random().toString(36).slice(2), sender, text, time: nowTime() };
    setMessages((s) => [...s, m]);
  }

  function proposeChange(key: string, value: string, by: Message["sender"]) {
    setCards((prev) => prev.map((c) => (c.key === key ? { ...c, value, status: "proposed" } : c)));
    addMessage(by, `${by === "client" ? "Cliente" : "Prestador"} propôs alteração em ${key}: ${value}`);
  }

  function acceptCard(key: string, by: Message["sender"]) {
    setCards((prev) => prev.map((c) => (c.key === key ? { ...c, status: "agreed" } : c)));
    addMessage(by, `${by === "client" ? "Cliente" : "Prestador"} aceitou ${key}.`);
  }

  function canProceedToSummary() {
    // require all cards to be agreed or at least no critical pending
    return cards.every((c) => c.status === "agreed" || c.key === "price" || c.key === "deadline");
  }

  function allAgreed() {
    return cards.every((c) => c.status === "agreed");
  }

  return (
    <div className="flex flex-col h-screen pt-20 text-[var(--text)] bg-[var(--bg-dark)]">
     {/* Main grid */}
      <div className="flex flex-1 overflow-hidden">
      

        {/* Center column: steps */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Step1ServicePreview
                  service={mockService}
                  onNext={() => setStep(1)}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Step2Negotiation
                  messages={messages}
                  onSend={(text) => addMessage("client", text)}
                  provider={provider}
                  client={client}
                  cards={cards}
                  proposeChange={proposeChange}
                  acceptCard={(key) => acceptCard(key, "client")}
                  onBack={() => setStep(0)}
                  onNext={() => setStep(2)}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Step3AgreementSummary
                  cards={cards}
                  onEdit={(k) => setEditing({ key: k, value: cards.find(c => c.key === k)?.value || "" })}
                  allAgreed={allAgreed()}
                  onBack={() => setStep(1)}
                  onNext={() => setStep(3)}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Step4Confirmation
                  cards={cards}
                  signed={signed}
                  onSign={(role) => setSigned((s) => ({ ...s, [role]: true }))}
                  onBack={() => setStep(2)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right column: live summary / actions */}
        <aside className="w-96 p-6 border-l border-[var(--bg-light)] bg-[var(--bg-dark)]/20 flex flex-col gap-6">
           {/* Barra de Progresso  */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-48 h-3 bg-[var(--bg-light)] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" style={{ width: `${progress}%` }} />
          </div>
        </div>
          <div className="rounded-2xl p-4 bg-[var(--bg-light)]/10 border border-[var(--bg-light)]/20 backdrop-blur-md">
            
            <div className="flex items-start justify-between">
              
              <div>
                
                <div className="text-sm text-[var(--text-muted)]">Resumo ao vivo</div>
                <div className="font-semibold text-lg mt-1">Resumo do Acordo</div>
              </div>
              <div className="text-xs text-[var(--text-muted)]">{messages.length} mensagens</div>
            </div>

            <div className="mt-4 space-y-3">
              {cards.map((c) => (
                <div key={c.key} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{c.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{c.value}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${c.status === "agreed" ? "text-green-400" : c.status === "proposed" ? "text-amber-400" : "text-[var(--text-muted)]"}`}>
                      {c.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 px-4 py-2 rounded-lg border border-[var(--bg-light)]/30 text-sm">Abrir negociação</button>
              <button onClick={() => setStep(2)} disabled={!canProceedToSummary()} className={`px-4 py-2 rounded-lg text-sm font-medium ${canProceedToSummary() ? "bg-blue-600 text-white" : "bg-[var(--bg-light)]/10 text-[var(--text-muted)] cursor-not-allowed"}`}>
                Ver resumo
              </button>
            </div>
          </div>

          <div className="rounded-xl p-4 bg-[var(--bg-light)]/10   border border-[var(--bg-light)]/20">
            <div className="text-sm text-[var(--text-muted)]">Ações rápidas</div>
            <div className="mt-3 flex flex-col gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-light)]/10 hover:bg-[var(--bg-light)]/20"> <PenTool className="w-4 h-4" /> Propor alteração</button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-light)]/10 hover:bg-[var(--bg-light)]/20"> <ShieldCheck className="w-4 h-4" /> Solicitar garantia</button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-light)]/10 hover:bg-[var(--bg-light)]/20"> <Upload className="w-4 h-4" /> Adicionar anexo</button>
            </div>
          </div>

          <div className="mt-auto text-xs text-[var(--text-muted)]">Histórico e logs estão disponíveis após confirmação.</div>
        </aside>
      </div>

      {/* Inline editor modal (simplificado) */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} className="relative z-50 w-[min(720px,92%)] p-6 rounded-2xl bg-[var(--bg-light)] border border-[var(--bg-light)]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Editar: {editing.key}</div>
                  <div className="text-xs text-[var(--text-muted)]">Altere o valor e proponha para o outro aceitar.</div>
                </div>
                <button onClick={() => setEditing(null)} className="text-[var(--text-muted)]"><XCircle /></button>
              </div>

              <div className="mt-4">
                <textarea className="w-full h-28 p-3 rounded-lg bg-[var(--bg)] text-[var(--text)] border border-[var(--bg-light)]/20" value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })} />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-[var(--bg-light)]/20">Cancelar</button>
                <button onClick={() => { if (editing) proposeChange(editing.key!, editing.value, "client"); setEditing(null); }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Propor alteração</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------- Subcomponents -------------------------- */

function Step1ServicePreview({ service, onNext }: { service: typeof mockService; onNext: () => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl p-6 bg-[var(--bg-light)]/10  border border-[var(--bg-light)]/20 backdrop-blur-md">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs text-[var(--text-muted)]">Serviço publicado por</div>
            <div className="font-semibold text-2xl mt-1">{service.title}</div>
            <div className="text-sm text-[var(--text-muted)] mt-2">{service.short}</div>

            <div className="mt-4 flex items-center gap-4">
              <div className="text-sm">
                <div className="text-[var(--text-muted)]">Prazo base</div>
                <div className="font-medium">{service.baseDays} dias úteis</div>
              </div>

              <div className="text-sm">
                <div className="text-[var(--text-muted)]">Preço</div>
                <div className="font-medium">{service.basePrice}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-xs text-[var(--text-muted)]">Avaliação</div>
            <div className="font-semibold">{service.provider.rating}★</div>
            <button onClick={onNext} className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium">Contratar / Negociar</button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-[var(--text-muted)]">Você está prestes a iniciar uma negociação. O prestador poderá aceitar ou propor alterações — tudo ficará registrado.</div>
    </div>
  );
}

function Step2Negotiation({ messages, onSend, provider, client, cards, proposeChange, acceptCard, onBack, onNext }: {
  messages: Message[];
  onSend: (text: string) => void;
  provider: Party;
  client: Party;
  cards: AgreementCard[];
  proposeChange: (k: string, v: string, by: Message["sender"]) => void;
  acceptCard: (k: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [text, setText] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-[var(--text-muted)]">Negociação — </div>
          <div className="font-semibold text-xl">Converse e ajuste os termos</div>
        </div>
        <div className="text-sm text-[var(--text-muted)]">Ambas as partes podem propor e aceitar mudanças</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Chat */}
        <div className="col-span-8">
          <div className="rounded-xl p-4 bg-[var(--bg-light)]/10   border border-[var(--bg-light)]/20 h-[60vh] overflow-auto flex flex-col">
            <div className="flex-1 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${m.sender === 'client' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-[var(--bg-light)] text-[var(--text)]'}`}>
                    <div className="text-sm">{m.text}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1 text-right">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva uma mensagem ou proponha algo..." className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg)] text-[var(--text)] border border-[var(--bg-light)]/20" />
              <button onClick={() => { if (text.trim()) { onSend(text.trim()); setText(''); } }} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Enviar</button>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={onBack} className="px-4 py-2 rounded-lg border border-[var(--bg-light)]/20">Voltar</button>
            <button onClick={onNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Resumo</button>
          </div>
        </div>

        {/* Cards */}
        <div className="col-span-4">
          <div className="rounded-xl p-4 bg-[var(--bg-light)]/10   border border-[var(--bg-light)]/20">
            <div className="font-medium">Itens do acordo</div>
            <div className="mt-3 space-y-3">
              {cards.map((c) => (
                <div key={c.key} className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--bg-light)]/10">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{c.value}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${c.status === 'agreed' ? 'text-green-400' : c.status === 'proposed' ? 'text-amber-400' : 'text-[var(--text-muted)]'}`}>{c.status}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button onClick={() => proposeChange(c.key, c.value + ' (ajuste)', 'client')} className="flex-1 px-3 py-2 rounded-md border border-[var(--bg-light)]/10 text-sm">Propor</button>
                    <button onClick={() => acceptCard(c.key)} className="px-3 py-2 rounded-md bg-green-600 text-white text-sm">Aceitar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3AgreementSummary({ cards, onEdit, allAgreed, onBack, onNext }: {
  cards: AgreementCard[];
  onEdit: (key: string) => void;
  allAgreed: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl p-6 bg-[var(--bg-light)]/10  border border-[var(--bg-light)]/20 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-[var(--text-muted)]">Resumo do acordo</div>
            <div className="font-semibold text-2xl mt-1">Revisão final dos termos</div>
          </div>
          <div className="text-xs text-[var(--text-muted)]">Status: {allAgreed ? 'Tudo acordado' : 'Aguardando ajustes'}</div>
        </div>

        <div className="mt-6 space-y-4">
          {cards.map((c) => (
            <div key={c.key} className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--bg-light)]/10 flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{c.value}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`text-xs font-medium ${c.status === 'agreed' ? 'text-green-400' : c.status === 'proposed' ? 'text-amber-400' : 'text-[var(--text-muted)]'}`}>{c.status}</div>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(c.key)} className="text-sm px-3 py-1 rounded-md border border-[var(--bg-light)]/10">Editar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button onClick={onBack} className="px-4 py-2 rounded-lg border border-[var(--bg-light)]/20">Voltar</button>
          <div>
            <button onClick={onNext} disabled={!allAgreed} className={`px-4 py-2 rounded-lg ${allAgreed ? 'bg-blue-600 text-white' : 'bg-[var(--bg-light)]/10 text-[var(--text-muted)] cursor-not-allowed'}`}>Prosseguir para assinatura</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4Confirmation({ cards, signed, onSign, onBack }: { cards: AgreementCard[]; signed: { provider: boolean; client: boolean }; onSign: (role: 'provider' | 'client') => void; onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl p-6 bg-[var(--bg-light)]/10  border border-[var(--bg-light)]/20 backdrop-blur-md">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm text-[var(--text-muted)]">Confirmação</div>
            <div className="font-semibold text-2xl mt-1">Assinatura e confirmação final</div>
            <div className="text-sm text-[var(--text-muted)] mt-3">Revise o acordo e assine digitalmente para concluir.</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-[var(--text-muted)]">Progresso</div>
            <div className="font-semibold text-lg mt-1">{signed.client && signed.provider ? 'Assinado' : 'Pendente'}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-1 p-4 rounded-lg bg-[var(--bg)] border border-[var(--bg-light)]/10">
            <div className="font-medium">Resumo do acordo</div>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
              {cards.map(c => (
                <div key={c.key} className="flex justify-between">
                  <div>{c.title}</div>
                  <div className="font-medium">{c.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 p-4 rounded-lg bg-[var(--bg)] border border-[var(--bg-light)]/10 flex flex-col justify-between">
            <div>
              <div className="text-sm text-[var(--text-muted)]">Assinaturas</div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Prestador</div>
                    <div className="text-xs text-[var(--text-muted)]">Alexandre Reis</div>
                  </div>
                  <div>
                    {signed.provider ? <div className="text-green-400 font-medium flex items-center gap-2"><CheckCircle /> Assinado</div> : <button onClick={() => onSign('provider')} className="px-3 py-2 rounded-md bg-blue-600 text-white">Assinar</button>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Cliente</div>
                    <div className="text-xs text-[var(--text-muted)]">Lucas William</div>
                  </div>
                  <div>
                    {signed.client ? <div className="text-green-400 font-medium flex items-center gap-2"><CheckCircle /> Assinado</div> : <button onClick={() => onSign('client')} className="px-3 py-2 rounded-md bg-blue-600 text-white">Assinar</button>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={onBack} className="px-4 py-2 rounded-lg border border-[var(--bg-light)]/20">Voltar</button>
              <div>
                <button disabled={!(signed.client && signed.provider)} className={`px-4 py-2 rounded-lg ${signed.client && signed.provider ? 'bg-green-600 text-white' : 'bg-[var(--bg-light)]/10 text-[var(--text-muted)] cursor-not-allowed'}`}>Finalizar contrato</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
