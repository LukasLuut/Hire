// ServiceNegotiationModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  DollarSign,
  Calendar,
  Timer,
  Handshake,
  CheckCircle,
  XCircle,
  X,
  Send,
  Paperclip,
} from "lucide-react";

/* ==========================================================================
   SECTION: Types (o Service que você especificou + tipos internos)
   ========================================================================= */

export interface Service {
  id?: number;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  price?: string;
  deliveryTime?: string;
  paymentMethod?: string;
  startDate?: string;
  duration?: string;
  attachments?: File[];
}

type TopicKey = "service" | "payment" | "start" | "duration" | "finalize";

type TopicState = "Acordado" | "Pendente" | "Negado";

interface Topic {
  key: TopicKey;
  label: string;
  tooltip: string;
  state: TopicState;
  // content aqui é string livre (pode conter resumo do tópico). Para campos específicos
  // usamos inputs no UI e sincronizamos esse content quando necessário.
  content: string;
}

/* -------------------------------------------------------------------------- */
/* ======================= SECTION: Helper / UI utilities ==================== */
/* -------------------------------------------------------------------------- */

const stateColor = (state: TopicState) =>
  state === "Acordado"
    ? "bg-green-500 text-white"
    : state === "Pendente"
    ? "bg-[var(--primary)] text-black"
    : "bg-red-500 text-white";

/* ==========================================================================
   SECTION: Component - ServiceNegotiationModal
   - Recebe um Service (preenchido ou vazio) e onClose
   ========================================================================= */

export default function ServiceNegotiationModal({
  service: initialService,
  isOpen,
  onClose,
  onFormalize, // callback opcional para envio para API quando formalizar
}: {
  service?: Service;
  isOpen: boolean;
  onClose: () => void;
  onFormalize?: (finalService: Service) => void;
}) {
  /* ---------------------------- states ---------------------------------- */

  // tópico principal: cada tópico contém estado e conteúdo (texto resumido)
  const [topics, setTopics] = useState<Topic[]>(() => [
    {
      key: "service",
      label: "Serviço previsto",
      tooltip: "Descrição e escopo do serviço (o que será entregue).",
      state: "Pendente",
      content: initialService?.title || initialService?.description || "",
    },
    {
      key: "payment",
      label: "Valor & método",
      tooltip: "Valor acordado e forma de pagamento.",
      state: "Pendente",
      content:
        (initialService?.price ? initialService.price : "") +
        (initialService?.paymentMethod ? ` • ${initialService.paymentMethod}` : ""),
    },
    {
      key: "start",
      label: "Data e hora de início",
      tooltip: "Defina quando o serviço deve começar.",
      state: "Pendente",
      content: initialService?.startDate || "",
    },
    {
      key: "duration",
      label: "Duração",
      tooltip: "Tempo estimado para entrega / realização do serviço.",
      state: "Pendente",
      content: initialService?.duration || initialService?.deliveryTime || "",
    },
    {
      key: "finalize",
      label: "Finalizar",
      tooltip: "Formalize o serviço ou encerre a negociação.",
      state: "Acordado",
      content: "",
    },
  ]);

  // referência ao tópico aberto (expandido). Null = nada expandido.
  const [expandedTopic, setExpandedTopic] = useState<TopicKey | null>(null);

  // Mensagens do chat
  const [messages, setMessages] = useState<
    { id: string; sender: "prestador" | "cliente" | "system"; text: string; time: string }[]
  >(() => [
    // mensagem inicial automática (system)
    { id: "m0", sender: "system", text: "Inicie a negociação ajustando os tópicos.", time: timeNow() },
  ]);

  // input do chat
  const [chatInput, setChatInput] = useState("");

  // Controle arquivos/attachments enviados via tópico (temporários)
  const [attachments, setAttachments] = useState<File[]>(initialService?.attachments || []);

  // confirmação animada (formalize / close)
  const [confirming, setConfirming] = useState<null | "formalize" | "close">(null);

  // para comportamento responsivo (mobile full-screen vs desktop floating)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------- effects ---------------------------------- */

  // manter scroll no fim ao adicionar mensagens
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // reset quando abrir/fechar modal (opcional)
  useEffect(() => {
    if (!isOpen) {
      // limpa confirmação e expandido ao fechar
      setConfirming(null);
      setExpandedTopic(null);
    }
  }, [isOpen]);

  /* ---------------------------- helpers ---------------------------------- */

  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function updateTopic(key: TopicKey, patch: Partial<Topic>) {
    setTopics((prev) => prev.map((t) => (t.key === key ? { ...t, ...patch } : t)));
  }

  function sendMessage(sender: "prestador" | "cliente" | "system", text: string) {
    const msg = { id: String(Date.now()) + Math.random().toString(36).slice(2), sender, text, time: timeNow() };
    setMessages((prev) => [...prev, msg]);
  }

  // enviar resumo de alteração do tópico para o chat (Propor alteração)
  function proposeChange(key: TopicKey, summary: string) {
    // atualiza o próprio tópico como "Pendente" (porque foi proposta uma mudança)
    updateTopic(key, { state: "Pendente", content: summary });
    // enviar mensagem resumida para o chat
    sendMessage("prestador", `Proposta de alteração em "${keyToLabel(key)}": ${summary}`);
    // opcional: expandir o tópico para revisão
    setExpandedTopic(key);
  }

  function keyToLabel(k: TopicKey) {
    const t = topics.find((x) => x.key === k);
    return t?.label ?? k;
  }

  /* ---------------------------- finalização/encerrar ---------------------- */

  const allAgreed = topics.every((t) => t.state === "Acordado");

  async function handleFormalize() {
    // confirmação animada
    setConfirming("formalize");
    // simula delay (ex: envio para API/registro)
    setTimeout(() => {
      // gera Service final com dados dos tópicos
      const finalService: Service = {
        title: topics.find((t) => t.key === "service")?.content || initialService?.title || "",
        description: topics.find((t) => t.key === "service")?.content || initialService?.description || "",
        price: topics.find((t) => t.key === "payment")?.content || initialService?.price || "",
        paymentMethod: undefined,
        startDate: topics.find((t) => t.key === "start")?.content || initialService?.startDate || "",
        duration: topics.find((t) => t.key === "duration")?.content || initialService?.duration || initialService?.deliveryTime || "",
        attachments,
      };
      sendMessage("system", "Serviço formalizado ✔️");
      onFormalize?.(finalService);
      // fecha após animação
      setTimeout(() => {
        setConfirming(null);
        onClose();
      }, 900);
    }, 800);
  }

  function handleCloseNegotiation() {
    setConfirming("close");
    sendMessage("system", "Negociação encerrada ✖️");
    setTimeout(() => {
      setConfirming(null);
      onClose();
    }, 900);
  }

  /* ==========================================================================
     SECTION: Render UI
     - Estruturado com sub-areas:
       - header (ícones tópicos)
       - left: painel tópicos expandido (ou área central)
       - right/bottom: chat sempre visível
     - Em mobile, ocupa tela inteira; em desktop, flutua canto inferior direito.
     ========================================================================= */

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* backdrop */}
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dim background */}
        <div className="absolute inset-0 bg-black/40" onClick={() => onClose()} />

        {/* Main container: mobile = full screen, desktop = small window bottom-right */}
        <motion.div
          initial={isMobile ? { y: 50, opacity: 0 } : { scale: 0.9, opacity: 0, y: 50 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
          exit={isMobile ? { y: 50, opacity: 0 } : { scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.28, type: "spring", stiffness: 250 }}
          // positioning responsive
          className={`fixed z-60 ${isMobile ? "inset-0 " : "right-6 bottom-6"} `}
        >
          <div
            // container card
            className={`flex ${isMobile ? "flex-col h-screen" : "flex-row"} w-full ${isMobile ? "" : "max-w-[920px]"} bg-[var(--bg-light)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]`}
            // evitar scroll horizontal
            style={{ minHeight: isMobile ? "100vh" : "520px", width: isMobile ? "100vw" : undefined }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ------------------------- LEFT / TOP: Tópicos (ícones) ------------------------- */}
            <div className={`flex ${isMobile ? "flex-row items-center px-4 py-2  overflow-x-auto" : "flex-col w-24 p-2 gap-4"} bg-[var(--bg)] border-r border-[var(--border)]`}>
              {/* Close button (mobile) */}
              {isMobile && (
                <div className="flex justify-between items-center w-full mb-1">
                  
                  <button onClick={onClose} className=" fixed text-[var(--text-muted)]">
                    <X size={20} />
                  </button>
                </div>
              )}

               {/* icons */}
                {topics.map((t) => {
                const isExpanded = expandedTopic === t.key;
                return (
                    <div key={t.key} className={`group ${isMobile ? "min-w-[80px] " : ""}`}>
                    <button
                        onClick={() => {
                        // toggle expand
                        setExpandedTopic((prev) => (prev === t.key ? null : t.key));
                        }}
                        className={`flex items-center gap-3 w-full p-2 rounded-lg transition ${
                        isExpanded ? "bg-[var(--highlight)]/10" : "hover:bg-[var(--highlight)]/5"
                        }`}
                    >
                        <div
                        className={`w-15 h-15 rounded-md flex items-center justify-center ${stateColor(t.state)}`}
                        >
                        {/* ícone simplificado pela label */}
                        {t.key === "service" && <MessageSquare stroke="white" size={18} />}
                        {t.key === "payment" && <DollarSign stroke="white" size={18} />}
                        {t.key === "start" && <Calendar stroke="white" size={18} />}
                        {t.key === "duration" && <Timer stroke="white" size={18} />}
                        {t.key === "finalize" && <Handshake stroke="white" size={18} />}
                        </div>

                        {/* desktop: mostra label e content apenas se expandido / mobile: nunca mostra */}
                        {!isMobile && isExpanded && (
                        <div className="flex-1 absolute max-w-40 h-auto p-3 rounded-xl text-wrap bg-[var(--bg)] -left-39.5 border-1 border-r-0 border-[var(--border)] text-left">
                            <div className="text-sm text-[var(--text)] font-medium">{t.label}</div>
                            <div className="text-xs text-wrap text-[var(--text-muted)] truncate">
                            {t.tooltip || "Não definido"}
                            </div>
                        </div>
                        )}
                    </button>

                   
                    </div>
                );
                })}

            </div>

            {/* ------------------------- MIDDLE: Expanded topic content ------------------------- */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              {/* Header area (service summary) */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    {initialService?.title || "Negociação do Serviço"}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Use o chat para alinhar cada tópico. Alterações podem ser propostas e serão enviadas ao chat.
                  </p>
                </div>

                {/* quick actions: attachments preview */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-muted)]">
                    <Paperclip size={16} />
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        setAttachments((prev) => [...prev, ...Array.from(files)]);
                        // add a system message notifying attachments
                        sendMessage("system", `${Array.from(files).length} arquivo(s) anexado(s).`);
                        e.currentTarget.value = "";
                      }}
                      className="hidden"
                    />
                    Anexos
                  </label>
                </div>
              </div>

              {/* Conteúdo do tópico expandido (se houver) */}
              <div className="flex-1 overflow-y-auto p-2">
                <AnimatePresence mode="wait">
                  {expandedTopic ? (
                    <motion.div
                      key={expandedTopic}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg"
                    >
                      {/* Renderiza um formulário inteligente por tópico */}
                      {(() => {
                        const t = topics.find((x) => x.key === expandedTopic)!;
                        switch (t.key) {
                          case "service":
                            return (
                              <>
                                <label className="flex flex-col mb-2">
                                  <span className="text-[var(--text-muted)] text-sm">Título / Resumo</span>
                                  <input
                                    value={t.content}
                                    onChange={(e) => updateTopic(t.key, { content: e.target.value })}
                                    placeholder="Resuma o serviço aqui (ex: Design de logo + 2 revisões)"
                                    className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)]"
                                  />
                                </label>

                                <label className="flex flex-col mb-2">
                                  <span className="text-[var(--text-muted)] text-sm">Descrição detalhada</span>
                                  <textarea
                                    value={t.content}
                                    onChange={(e) => updateTopic(t.key, { content: e.target.value })}
                                    placeholder="Descreva o escopo, entregáveis e limites..."
                                    rows={4}
                                    className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)] resize-none"
                                  />
                                </label>

                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => updateTopic(t.key, { state: "Acordado" })}
                                    className="px-1 md:px-3 py-1 rounded bg-green-500/20 text-green-600 hover:bg-green-500/30"
                                  >
                                    Acordado
                                  </button>
                                  <button
                                    onClick={() => updateTopic(t.key, { state: "Pendente" })}
                                    className="px-1 md:px-3 py-1 rounded bg-[var(--primary)]/20 text-[var(--primary)]/90 hover:bg-[var(--primary)]/40"
                                  >
                                    Pendente
                                  </button>
                                  <button
                                    onClick={() => updateTopic(t.key, { state: "Negado" })}
                                    className="px-1 md:px-3 py-1 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30"
                                  >
                                    Negado
                                  </button>

                                  <button
                                    onClick={() => proposeChange(t.key, t.content)}
                                    className="ml-auto px-1 md:px-3 py-1 rounded bg-[var(--highlight)] text-black hover:brightness-105"
                                  >
                                    Propor alteração
                                  </button>
                                </div>
                              </>
                            );
                          case "payment":
                            return (
                              <>
                                <div className="grid grid-cols-2 gap-3">
                                  <label className="flex flex-col">
                                    <span className="text-[var(--text-muted)] text-sm">Valor (R$)</span>
                                    <input
                                      value={extractAmount(t.content)}
                                      onChange={(e) => updateTopic(t.key, { content: `${e.target.value} • ${extractPaymentMethod(t.content)}` })}
                                      placeholder="Ex: 250.00"
                                      className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)]"
                                    />
                                  </label>

                                  <label className="flex flex-col">
                                    <span className="text-[var(--text-muted)] text-sm">Método de pagamento</span>
                                    <input
                                      value={extractPaymentMethod(t.content)}
                                      onChange={(e) => updateTopic(t.key, { content: `${extractAmount(t.content)} • ${e.target.value}` })}
                                      placeholder="Ex: Pix, Transferência, Cartão"
                                      className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)]"
                                    />
                                  </label>
                                </div>

                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => updateTopic(t.key, { state: "Acordado" })} className="px-1 md:px-3 py-1 rounded bg-green-500/20 text-green-600 hover:bg-green-500/30">Acordado</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Pendente" })} className="px-1 md:px-3 py-1 rounded bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Pendente</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Negado" })} className="px-1 md:px-3 py-1 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30">Negado</button>

                                  <button onClick={() => proposeChange(t.key, t.content)} className="ml-auto px-1 md:px-3 py-1 rounded bg-[var(--highlight)] text-black hover:brightness-105">Propor alteração</button>
                                </div>
                              </>
                            );
                          case "start":
                            return (
                              <>
                                <label className="flex flex-col">
                                  <span className="text-[var(--text-muted)] text-sm">Data e hora</span>
                                  <input
                                    type="datetime-local"
                                    value={t.content}
                                    onChange={(e) => updateTopic(t.key, { content: e.target.value })}
                                    className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)]"
                                  />
                                </label>

                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => updateTopic(t.key, { state: "Acordado" })} className="px-1 md:px-3 py-1 rounded bg-green-500/20 text-green-600 hover:bg-green-500/30">Acordado</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Pendente" })} className="px-1 md:px-3 py-1 rounded bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Pendente</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Negado" })} className="px-1 md:px-3 py-1 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30">Negado</button>

                                  <button onClick={() => proposeChange(t.key, t.content)} className="ml-auto px-1 md:px-3 py-1 rounded bg-[var(--highlight)] text-black hover:brightness-105">Propor alteração</button>
                                </div>
                              </>
                            );
                          case "duration":
                            return (
                              <>
                                <label className="flex flex-col">
                                  <span className="text-[var(--text-muted)] text-sm">Duração estimada</span>
                                  <input
                                    placeholder="Ex: 02:00 (hh:mm) ou '3 dias'"
                                    value={t.content}
                                    onChange={(e) => updateTopic(t.key, { content: e.target.value })}
                                    className="mt-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded text-[var(--text)]"
                                  />
                                </label>

                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => updateTopic(t.key, { state: "Acordado" })} className="px-1 md:px-3 py-1 rounded bg-green-500/20 text-green-600 hover:bg-green-500/30">Acordado</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Pendente" })} className="px-1 md:px-3 py-1 rounded bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Pendente</button>
                                  <button onClick={() => updateTopic(t.key, { state: "Negado" })} className="px-1 md:px-3 py-1 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30">Negado</button>

                                  <button onClick={() => proposeChange(t.key, t.content)} className="ml-auto px-1 md:px-3 py-1 rounded bg-[var(--highlight)] text-black hover:brightness-105">Propor alteração</button>
                                </div>
                              </>
                            );
                          case "finalize":
                            return (
                              <>
                                <p className="text-[var(--text-muted)]">Neste tópico você pode formalizar ou encerrar a negociação. Formalizar fica disponível apenas quando todos os tópicos estiverem marcados como "Acordado".</p>

                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() => handleCloseNegotiation()}
                                    className="px-1 md:px-3 py-2 rounded bg-red-500/20 text-red-600 hover:bg-red-500/30"
                                  >
                                    Encerrar negociação
                                  </button>

                                  <button
                                    disabled={!allAgreed}
                                    onClick={() => setConfirming("formalize")}
                                    className={`px-1 md:px-3 py-2 rounded font-semibold ${allAgreed ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed"}`}
                                  >
                                    Formalizar Serviço
                                  </button>

                                  {/* botão para enviar resumo pro chat */}
                                  <button
                                    onClick={() => {
                                      sendMessage("prestador", `Pedido de formalização: todos os tópicos estão ${allAgreed ? "acordados" : "pendentes"}.`);
                                    }}
                                    className="ml-auto px-1 md:px-3 py-2 rounded bg-[var(--highlight)] text-black hover:brightness-105"
                                  >
                                    Enviar resumo ao chat
                                  </button>
                                </div>
                              </>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[var(--text-muted)]">
                      Selecione um tópico para editar e propor alterações.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ------------------------- BOTTOM: Chat (sempre visível) ------------------------- */}
              <div className="border-t  border-[var(--border)] pt-3">
                <div ref={chatScrollRef} className="max-h-100 md:max-h-86 overflow-y-auto space-y-2 px-2 pb-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "prestador" ? "justify-end" : m.sender === "cliente" ? "justify-start" : "justify-center"}`}>
                      <div className={`max-w-[85%] px-3 py-2 rounded-lg ${m.sender === "prestador" ? "bg-[var(--primary)] text-white" : m.sender === "cliente" ? "bg-[var(--bg)] text-[var(--text)]" : "bg-[var(--bg-dark)]/70 text-[var(--text-muted)]"} `}>
                        <div className="text-sm">{m.text}</div>
                        <div className="text-xs text-[var(--text-muted)] text-right mt-1">{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* input do chat */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    // envia como 'cliente' local por padrão — em app real, atribuir sender dinamicamente
                    sendMessage("cliente", chatInput.trim());
                    setChatInput("");
                  }}
                  className="mt-2 flex items-center gap-2"
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-2 bg-[var(--bg-light)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                  />
                  <button type="submit" className="px-3 py-2 rounded bg-[var(--primary)] text-white">
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Confirmação animada (overlay) */}
          <AnimatePresence>
            {confirming === "formalize" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="bg-[var(--bg)] p-6 rounded-lg shadow-lg border border-[var(--border)] text-center">
                  
                  <CheckCircle size={40} className="mx-auto text-green-500" />
                  <p className="mt-3 text-[var(--text)] font-semibold">Confirmar formalização?</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <button onClick={() => setConfirming(null)} className="px-3 py-2 rounded bg-[var(--border)] text-[var(--text-muted)]">Cancelar</button>
                    <button onClick={handleFormalize} className="px-3 py-2 rounded bg-green-500 text-white">Confirmar</button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {confirming === "close" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-50">
                <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }} className="bg-[var(--bg)] p-6 rounded-lg shadow-lg border border-[var(--border)] text-center">
                  <XCircle size={40} className="mx-auto text-red-500" />
                  <p className="mt-3 text-[var(--text)] font-semibold">Encerrar negociação?</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <button onClick={() => setConfirming(null)} className="px-3 py-2 rounded bg-[var(--border)] text-[var(--text-muted)]">Cancelar</button>
                    <button onClick={handleCloseNegotiation} className="px-3 py-2 rounded bg-red-500 text-white">Confirmar</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ==========================================================================
   SECTION: Small helpers used above
   - extractAmount / extractPaymentMethod: helpers simples para separar valor • método
   ========================================================================= */

function extractAmount(s: string) {
  if (!s) return "";
  const parts = s.split("•").map((p) => p.trim());
  // se primeiro for número-like, retorna
  return parts[0] || "";
}

function extractPaymentMethod(s: string) {
  if (!s) return "";
  const parts = s.split("•").map((p) => p.trim());
  return parts[1] || "";
}
