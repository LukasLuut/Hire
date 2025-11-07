import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

/* --------------------------------------------------------------------------
 * Modal de Recusa de Proposta de Serviço
 * -------------------------------------------------------------------------- */
export default function RejectProposalModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [closing, setClosing] = useState(false);

  if (!isOpen) return null;

  // Handler de fechamento com animação
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  // Handler de confirmação com animação de sucesso
  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => {
      setClosing(true);
      setTimeout(() => {
        onConfirm(reason);
        setSuccess(false);
        setClosing(false);
        setReason("");
        onClose();
      }, 400);
    }, 1600);
  };

  return (
    
        <AnimatePresence>
        <motion.div
            className="fixed inset-0 bg-black/90  flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(4px)" }}
            animate={{
                scale: closing ? 0.8 : 1,
                opacity: closing ? 0 : 1,
                filter: closing ? "blur(6px)" : "blur(0px)",
            }}
            exit={{ scale: 0.8, opacity: 0, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            className="relative w-full max-w-md bg-[rgba(20,20,20,0.6)] 
                        border border-[rgba(255,255,255,0.15)] 
                        backdrop-blur-2xl rounded-2xl shadow-2xl p-6
                        flex flex-col items-center text-center"
            >
            {/* Botão de fechar */}
            {!success && (
                <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                >
                <X size={20} />
                </button>
            )}

            {/* Estado normal */}
            {!success ? (
                <>
                {/* Ícone e texto principal */}
                <div className="flex flex-col items-center gap-4 mb-4">
                    <AlertTriangle className="w-12 h-12 text-[var(--primary)]" />
                    <h2 className="text-lg font-semibold text-white">
                    Recusar proposta de serviço
                    </h2>
                    <p className="text-sm text-white/80 max-w-sm">
                    Tem certeza de que deseja recusar esta proposta? Você pode
                    opcionalmente informar o motivo abaixo para ajudar o cliente a
                    entender.
                    </p>
                </div>

                {/* Campo opcional de motivo */}
                <textarea
                    placeholder="Motivo (opcional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[var(--bg-dark)] text-[var(--text)] text-sm
                            outline-none border border-transparent focus:border-[var(--primary)] 
                            resize-none min-h-[80px] mb-6"
                />

                {/* Botões de ação */}
                <div className="flex gap-3 w-full">
                    <button
                    onClick={handleClose}
                    className="flex-1 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
                    >
                    Cancelar
                    </button>

                    <button
                    onClick={handleConfirm}
                    className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition"
                    >
                    Confirmar recusa
                    </button>
                </div>
                </>
            ) : (
                /* Estado de sucesso */
                <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="flex flex-col items-center justify-center py-10"
                >
                <CheckCircle2 className="w-16 h-16 text-[var(--primary)] mb-4" />
                <h3 className="text-lg font-semibold text-white">
                    Proposta recusada com sucesso!
                </h3>
                <p className="text-sm text-white/80 mt-2">
                    O cliente será notificado da sua decisão.
                </p>
                </motion.div>
            )}
            </motion.div>
        </motion.div>
        </AnimatePresence>
 
  );
}
