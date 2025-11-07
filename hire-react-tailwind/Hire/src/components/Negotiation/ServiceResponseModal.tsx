import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, FileText, Upload, Send, XCircle } from "lucide-react";
import { SmallTooltip } from "./ServiceNegotiationModal"; // aquele tooltip corrigido que você já tem
import img from '../../../public/img/Danger.png'
import RejectProposalModal from "./RejectProposalModal";

interface Service {
  id?: number;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  price?: string;
  deliveryTime?: string;
  attachments?: File[];
}

interface ClientProposal {
  clientName: string;
  serviceDescription: string;
  budget: string;
  date: string;
  notes?: string;
  files?: File[];
}

/* --------------------------------------------------------------------------
 * MODAL DE RESPOSTA DO PRESTADOR
 * -------------------------------------------------------------------------- */
export default function ServiceResponseModal({
  isOpen,
  onClose,
  
}: {
  isOpen: boolean;
  onClose: () => void;
  
}) {
  
  let clientProposal= {
  clientName: 'Lucas Luut',
  serviceDescription: 'FAZER UM MEXE AQUI E ALI POR UM PREÇO CAMARADA',
  budget: '20 pila',
  date: 'Hoje',
  notes: 'Não esquece o oitão',
  files:[img]
  
}

  const [service, setService] = useState<Service>({
    title: `Proposta para ${clientProposal.clientName}`,
    description: clientProposal.serviceDescription,
    price: clientProposal.budget,
    deliveryTime: "",
    attachments: [],
  });

  const [sent, setSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!isOpen) return null;
  const handleRefuse=()=>{
    setRejectOpen(true);

  }

  const handleSend = () => {
    setSent(true);
    setTimeout(() => onClose(), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setService({ ...service, attachments: [...(service.attachments || []), ...newFiles] });
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
  };

  return (
    <div
      className="fixed modal-scroll inset-0 z-50 bg-black/70 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl md:rounded-2xl bg-[var(--bg)]/80 
        backdrop-blur-xl border border-[rgba(255,255,255,0.15)] shadow-2xl text-[var(--text)] 
        overflow-y-auto max-h-[90vh] md:max-h-[85vh] p-6 md:p-10"
      >
        {/* Botão X de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-5 h-5 text-[var(--text)]" />
        </button>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* ------------------------------------------------------------------
               * RESUMO DA SOLICITAÇÃO
               * ------------------------------------------------------------------ */}
              <section>
                <h2 className="text-xl font-semibold mb-2">
                  Solicitação de {clientProposal.clientName}
                </h2>
                <div className="bg-black/30 rounded-xl p-4 border border-white/10 space-y-3 text-sm">
                  <p>
                    <strong>Descrição:</strong> {clientProposal.serviceDescription}
                  </p>
                  <p>
                    <strong>Orçamento:</strong> {clientProposal.budget}
                  </p>
                  <p>
                    <strong>Data solicitada:</strong> {clientProposal.date || "—"}
                  </p>
                  {clientProposal.notes && (
                    <p>
                      <strong>Observações:</strong> {clientProposal.notes}
                    </p>
                  )}
                  {clientProposal.files?.length ? (
                    <div>
                      <strong>Anexos do cliente:</strong>
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {clientProposal.files.map((file, i) => (
                          <div
                            key={i}
                            className="w-20 h-20 bg-[var(--bg-light)] rounded-lg border border-[var(--border)] flex items-center justify-center text-xs text-center p-1"
                          >
                            <FileText className="w-5 h-5 text-[var(--primary)]" />
                            {file.length > 10
                              ? file.slice(0, 10) + "..."
                              : file}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              {/* ------------------------------------------------------------------
               * FORMULÁRIO DE RESPOSTA DO PRESTADOR
               * ------------------------------------------------------------------ */}
              <section className="space-y-5">
                <h3 className="text-lg font-semibold text-[var(--primary)]">
                  Sua proposta de serviço
                </h3>

                <FormField
                  label="Título do serviço"
                  value={service.title}
                  onChange={(v) => setService({ ...service, title: v })}
                  tooltip="Um título claro e direto ajuda o cliente a entender o que você está oferecendo."
                />

                <FormField
                  label="Descrição"
                  isTextArea
                  value={service.description}
                  onChange={(v) => setService({ ...service, description: v })}
                  tooltip="Explique como você executará o serviço solicitado."
                />

                <FormField
                  label="Preço"
                  value={service.price || ""}
                  onChange={(v) => setService({ ...service, price: v })}
                  tooltip="Defina o valor da sua proposta."
                />

                <FormField
                  label="Prazo de entrega (ou início)"
                  value={service.deliveryTime || ""}
                  onChange={(v) => setService({ ...service, deliveryTime: v })}
                  tooltip="Informe em quanto tempo você pode realizar o serviço."
                />

                {/* Upload de arquivos */}
                <div className="space-y-2">
                  <label className="block font-medium">Anexos (opcional)</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center p-3 border border-[var(--border)] rounded-lg 
                    bg-[rgba(255,255,255,0.1)] cursor-pointer hover:bg-[rgba(255,255,255,0.15)] transition"
                  >
                    <Upload className="w-5 h-5 mr-2 text-[var(--primary)]" />
                    Enviar anexos
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {service.attachments?.length ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {service.attachments.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 bg-black/40 border border-[var(--border)] 
                          px-2 py-1 rounded-md text-xs backdrop-blur-sm"
                        >
                          <FileText className="w-3 h-3 text-[var(--primary)]" />
                          {f.name}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>

              {/* ------------------------------------------------------------------
               * AÇÕES FINAIS
               * ------------------------------------------------------------------ */}
              <section className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  onClick={handleRefuse}
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-black/40 text-white hover:bg-black/60 transition border border-[var(--border)]"
                >
                  <XCircle className="w-5 h-5" />
                  Recusar proposta
                </button>
                <button
                  onClick={handleSend}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 shadow-md"
                >
                  <Send className="w-5 h-5" />
                  Enviar proposta de serviço
                </button>
              </section>
                 <RejectProposalModal
                    isOpen={rejectOpen}
                    onClose={() => setRejectOpen(false)}
                    onConfirm={(reason) => {
                    console.log("Recusado com motivo:", reason);
                    setRejectOpen(false);
                }}
                />
            </motion.div>
         
          ) : (
            /* ------------------------------------------------------------------
             * CONFIRMAÇÃO DE ENVIO
             * ------------------------------------------------------------------ */
            <motion.div
              key="sent"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center justify-center py-12 space-y-6"
            >
              <CheckCircle2 className="w-16 h-16 text-[var(--primary)]" />
              <h2 className="text-xl font-semibold">Proposta enviada!</h2>
              <p className="opacity-80 text-center max-w-sm">
                Sua proposta foi enviada ao cliente.  
                Você será notificado assim que ele responder.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * CAMPO DE FORMULÁRIO REUTILIZÁVEL
 * -------------------------------------------------------------------------- */
function FormField({
  label,
  value,
  onChange,
  tooltip,
  isTextArea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  tooltip?: string;
  isTextArea?: boolean;
}) {
  return (
    <div className="relative">
      <label className="block font-medium mb-1 text-white">{label}</label>
      {isTextArea ? (
        <textarea
          className="w-full p-3 rounded-lg border border-[var(--border)] bg-black/30 text-white 
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full p-3 rounded-lg border border-[var(--border)] bg-black/30 text-white 
          focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {tooltip && <SmallTooltip text={tooltip} />}
    </div>
  );
}
