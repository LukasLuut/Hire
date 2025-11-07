import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  CheckCircle2,
  Info,
  Upload,
  FileText,
  Save,
  FolderOpen,
  X,
} from "lucide-react";
import ServiceResponseModal from "./ServiceResponseModal";

/* --------------------------------------------------------------------------
 * ServiceNegotiationModal.tsx
 *
 * Modal passo-a-passo para enviar um pedido de orçamento a um prestador.
 * Recursos incluídos:
 * - Glassmorphism fumê (backdrop blur + cor escura translúcida)
 * - var(--primary) como cor principal para botões/destaques
 * - Inputs, labels e textos opacos (legibilidade)
 * - Salvar / Carregar rascunho (localStorage) — AVISO sobre arquivos
 * - Upload de anexos e preview (miniaturas 80x80 no resumo)
 * - Full-screen no mobile, card centralizado no desktop
 * - Botão "X" para fechar (sempre visível)
 * - Barra de progresso animada
 * - Animações de entrada/saída (blur, scale, bounce)
 * -------------------------------------------------------------------------- */

/* Props:
 * - isOpen: controla visibilidade externa
 * - onClose: função para fechar (passada pelo pai)
 * - service: dados mínimos do serviço (title, provider)
 */


export default function ServiceNegotiationModal({
  isOpen,
  onClose,
  
}: {
  isOpen: boolean;
  onClose: () => void;
  
}) {
  /* ---------------------------
   * Estados principais
   * --------------------------- */
  const [step, setStep] = useState<number>(1); // 1..4
  const [formData, setFormData] = useState({
    serviceDescription: "",
    budget: "",
    date: "",
    notes: "",
  });
  // arquivos selecionados (manter objetos File para preview enquanto a modal está aberta)
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  

  // para animar o fechamento com bounce + blur
  const [isClosing, setIsClosing] = useState(false);

  // abertura temporária do modal de resposta de solicitação de serviço
  const[isOpenResponse, setIsOpenResponse]=useState(false)

  // chave no localStorage para rascunhos
  const DRAFT_KEY = "serviceDraft_v1";

  useEffect(() => {
    if (!isOpen) {
      // reset internal state when modal closed (opcional)
      setStep(1);
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  /* ---------------------------
   * Funções auxiliares
   * --------------------------- */
  const nextStep = () => {
    // Validações leves no passo 2 (form)
    if (step === 2) {
      if (!formData.serviceDescription.trim()) {
        alert("Por favor, descreva o serviço desejado antes de continuar.");
        return;
      }
      if (!formData.budget.trim()) {
        alert("Por favor, informe o orçamento.");
        return;
      }
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    // limitar número / tamanho se quiser (ex: 6 arquivos)
    setFiles((prev) => [...prev, ...arr].slice(0, 8));
    // limpar input para permitir reupload do mesmo arquivo se necessário
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFileAt = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------------------
   * Rascunho: salvar / carregar
   * Nota: Files (File objects) NÃO são serializáveis em localStorage.
   * Salvamos formData + metadados (nomes). Avisamos o usuário que os
   * arquivos precisam ser reanexados ao carregar o rascunho.
   * --------------------------- */
  const saveDraft = () => {
    const draft = {
      formData,
      filesMeta: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      alert("Rascunho salvo com sucesso! (arquivos não são persistidos no rascunho)");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar rascunho.");
    }
  };

  const loadDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      alert("Nenhum rascunho encontrado.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setFormData(parsed.formData || formData);
      // não podemos restaurar arquivos reais — apenas mostrar metadados
      const meta: { name: string }[] = parsed.filesMeta || [];
      if (meta.length > 0) {
        alert(
          `Rascunho carregado. Atenção: ${meta.length} arquivo(s) referenciados no rascunho não foram restaurados automaticamente. Reanexe-os se necessário.`
        );
      } else {
        alert("Rascunho carregado.");
      }
      // limpar arquivos atuais (pois os metadados não permitem reconstituir File objects)
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar rascunho.");
    }
  };

  /* ---------------------------
   * Enviar proposta (mock)
   * - aqui você chamaria sua API para enviar o pedido.
   * - depois de enviar, passamos à etapa 4 (confirmação)
   * --------------------------- */
  const submitProposal = async () => {
    // Mock de envio — substituir pela chamada real ao backend
    // Ex.: const res = await api.post("/proposals", { formData, ... })
    // mostrar carregamento, tratar erros, etc.
    setStep(4);
    // opcional: limpar rascunho salvo no localStorage
    localStorage.removeItem(DRAFT_KEY);
  };

  /* ---------------------------
   * Função de fechar com animação
   * - toca animação de saída e chama onClose no final
   * --------------------------- */
  const handleClose = () => {
    setIsClosing(true);
    setIsOpenResponse(true);
    // esperar 420ms (mesma duração da animação) antes de realmente fechar
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 420);
  };

  /* ---------------------------
   * Variants Framer Motion
   * --------------------------- */
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(10px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.98, filter: "blur(6px)" },
  };

  const containerClass = `
    relative
    w-full
    max-w-2xl
    md:max-w-3xl
    rounded-2xl
    border
    border-[rgba(255,255,255,0.12)]
    p-4 md:p-6
    text-[var(--text)]
    overflow-y-auto
    max-h-[90vh]
    sm:max-h-[90vh]
    /* glassmorphism fumê */
    bg-[var(--bg)]/80
    backdrop-blur-[20px]
    backdrop-saturate-[160%]
    
  `;

  return (
    /* Backdrop: clique fora fecha (também previne rolagem do fundo) */
    <div
      className="fixed inset-0  z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay com blur extra; se quiser fechar clicando no overlay habilite onClick */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute  inset-0 bg-black/60"
        onClick={handleClose} // fechar ao clicar fora
      />

      <AnimatePresence mode="wait">
        <motion.div
          // impedir clique do overlay de propagar para o modal
          onClick={(e) => e.stopPropagation()}
          key={step + (isClosing ? "-closing" : "")}
          variants={modalVariants}
          initial="hidden"
          animate={isClosing ? "exit" : "visible"}
          exit="exit"
          transition={{ duration: 0.42, ease: [0.2, 0.85, 0.25, 1.0] }} // curva com leve bounce
          className={
            /* Responsividade:
               - mobile: ocupa toda a tela (h-full w-full rounded-none)
               - desktop: max-w card centralizado com bordas arredondadas
            */
            "relative mx-4 sm:mx-6 " +
            "w-full " +
            /* for mobile full screen: */
            "h-full sm:h-auto sm:rounded-2xl sm:mx-auto " +
            containerClass
          }
          
        >
          {/* ---------------------------
           * Close (X) — sempre visível no canto superior direito
           * --------------------------- */}
          <button
            aria-label="Fechar"
            onClick={handleClose}
            className="absolute right-3 top-3 z-20 flex items-center justify-center rounded-full p-2 
              bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.06)]"
            title="Fechar"
          >
            <X className="w-4 h-4 text-[var(--text)]" />
          </button>

          {/* ---------------------------
           * Barra de progresso + indicador de etapa
           * --------------------------- */}
          <div className="mb-4 pr-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">
                Passo {step} de 4
              </div>
              <div className="text-xs  opacity-80"><p>PROVEDOR DE SERVIÇO</p></div>
            </div>

            <div className="w-full h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="h-full rounded-full"
                style={{ background: "var(--primary)" }}
              />
            </div>
          </div>

          {/* ---------------------------
           * Conteúdo das etapas (AnimatePresence para trocar com animação)
           * --------------------------- */}
          <div className=" justify-center">
            <AnimatePresence mode="wait">
              {/* ---------- ETAPA 1: INTRO ---------- */}
              {step === 1 && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-center  px-2"
                >
                  <MessageCircle className="mx-auto w-12 h-12 text-[var(--primary)] opacity-95" />
                  <h2 className="text-xl font-semibold mt-2">Você está prestes a iniciar uma negociação</h2>
                  <p className="text-sm mt-2 opacity-90">
                    O prestador poderá aceitar ou propor alterações — tudo ficará registrado para garantir transparência e segurança.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={() => nextStep()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium"
                      style={{
                        background: "var(--primary)",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.24)",
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Iniciar Negociação
                    </button>

                   
                  </div>
                </motion.div>
              )}

              {/* ---------- ETAPA 2: FORMULÁRIO GUIADO ---------- */}
              {step === 2 && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-center">Solicitação para PROVEDOR DE SERVIÇO</h3>

                  {/* -- Campo: Serviço (textarea, opaco) */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Serviço desejado</label>
                    <textarea
                      value={formData.serviceDescription}
                      onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                      placeholder="Descreva o que você precisa..."
                      className="w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[var(--bg-light)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      rows={4}
                    />
                    <SmallTooltip text="Explique o que você deseja que o prestador faça. Seja claro, sem termos técnicos." />
                  </div>

                  {/* -- Campo: Orçamento */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Orçamento</label>
                    <input
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="Ex: R$ 500"
                      className="w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[var(--bg-light)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      type="text"
                    />
                    <SmallTooltip text="Informe o valor médio que você pretende investir. Isso ajuda o prestador a avaliar." />
                  </div>

                  {/* -- Campo: Data */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Data desejada</label>
                    <input
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[var(--bg-light)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      type="date"
                    />
                    <SmallTooltip text="Escolha uma data de início ou entrega, se necessário." />
                  </div>

                  {/* -- Campo: Observações */}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1">Observações</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Detalhes adicionais, preferências ou dúvidas..."
                      className="w-full p-3 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[var(--bg-light)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      rows={3}
                    />
                    <SmallTooltip text="Informações extras que ajudarão o prestador." />
                  </div>

                  {/* -- Campo: Anexos */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Anexos (opcional)</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 p-3 rounded-lg border border-[rgba(255,255,255,0.06)] cursor-pointer select-none"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <Upload className="w-5 h-5 text-[var(--primary)]" />
                      <div className="text-sm opacity-90">Clique ou toque para enviar imagens / PDFs</div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={handleFiles}
                    />

                    {files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 bg-[rgba(255,255,255,0.02)] px-2 py-1 rounded-md border border-[rgba(255,255,255,0.04)]">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs">{f.name}</span>
                            <button
                              onClick={() => removeFileAt(i)}
                              className="ml-1 text-xs opacity-80 hover:opacity-100"
                              title="Remover"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* -- Botões: carregar/salvar/continuar */}
                  <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-end items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={loadDraft}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <FolderOpen className="w-4 h-4" /> Carregar rascunho
                      </button>

                      <button
                        onClick={saveDraft}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <Save className="w-4 h-4" /> Salvar rascunho
                      </button>
                    </div>

                    <div className="flex gap-2 ml-auto">
                      <button onClick={prevStep} className="px-3 py-2 rounded-md text-sm opacity-90">Voltar</button>
                      <button
                        onClick={nextStep}
                        className="px-4 py-2 rounded-md text-white font-medium"
                        style={{ background: "var(--primary)" }}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---------- ETAPA 3: RESUMO ---------- */}
              {step === 3 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-center">Revisar sua solicitação</h3>

                  <div className="p-3 rounded-lg border border-[rgba(255,255,255,0.04)]" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <p className="text-sm"><strong>Serviço:</strong> {formData.serviceDescription || "—"}</p>
                    <p className="text-sm"><strong>Orçamento:</strong> {formData.budget || "—"}</p>
                    <p className="text-sm"><strong>Data:</strong> {formData.date || "—"}</p>
                    <p className="text-sm"><strong>Observações:</strong> {formData.notes || "—"}</p>

                    {/* Thumbnails (miniaturas 80x80) */}
                    {files.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-sm">Anexos</strong>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {files.map((f, i) => {
                            const url = URL.createObjectURL(f);
                            return (
                              <div
                                key={i}
                                className="w-[80px] h-[80px] rounded-md overflow-hidden border border-[rgba(255,255,255,0.06)] relative"
                                title={f.name}
                              >
                                {f.type.startsWith("image/") ? (
                                  <img src={url} alt={f.name} className="object-cover w-full h-full" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.2)] text-xs p-2">
                                    <div className="text-center">
                                      <div className="mb-1"><FileText className="w-5 h-5 mx-auto" /></div>
                                      <div className="text-[10px]">{f.name}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <button onClick={prevStep} className="px-3 py-2 rounded-md text-sm opacity-90">Voltar</button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          saveDraft();
                        }}
                        className="px-3 py-2 rounded-md text-sm"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                      >
                        <Save className="w-4 h-4 inline-block mr-1" /> Salvar
                      </button>
                      <button
                        onClick={submitProposal}
                        className="px-4 py-2 rounded-md text-white font-medium"
                        style={{ background: "var(--primary)" }}
                      >
                        Enviar proposta
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ---------- ETAPA 4: CONFIRMAÇÃO ---------- */}
              {step === 4 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { duration: 0.45, ease: "backOut" } }}
                  >
                    <CheckCircle2 className="mx-auto w-16 h-16 text-[var(--primary)]" />
                  </motion.div>

                  <h3 className="text-xl font-semibold mt-3">Proposta enviada!</h3>
                  <p className="text-sm mt-2 opacity-90">
                    Sua solicitação foi enviada para <strong>PROVEDOR DE SERVIÇO</strong>. Você será notificado assim que o prestador responder.
                  </p>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleClose}
                      className="px-5 py-2 rounded-lg text-white font-medium"
                      style={{ background: "var(--primary)" }}
                    >
                      Fechar
                    </button>
                   
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
      </AnimatePresence>
       
    </div>
  );
}

/* --------------------------------------------------------------------------
 * SmallTooltip
 * - tooltip simples mostrado no hover (desktop) / focus (mobile friendly)
 * - os textos dos campos e labels são opacos para leitura (bg var(--bg-light))
 * -------------------------------------------------------------------------- */
export function SmallTooltip({ text }: { text: string }) {
    const [visible, setVisible] = useState(false);
  return (
     <div
      className="absolute right-2 top-1 z-50"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0} // permite foco via teclado
    >
      <Info className="w-4 h-4 text-[var(--text-muted)] cursor-pointer opacity-70 hover:opacity-100 transition" />
      {visible && (
        <div
          className="absolute -top-1 right-6 text-xs text-[var(--text)] bg-[var(--bg-light)] 
          border border-[var(--border)] rounded-md p-2 w-52 shadow-lg backdrop-blur-md 
          animate-fadeIn"
        >
          {text}
        </div>
      )}
    </div>
  );
}
