// StepPreferences.tsx
// --------------------
// Etapa 5 — ajustes finos e visibilidade aprimorada com animações e ícones

import React from "react";
import { type ProviderForm, Toggle } from "../helpers/types-and-helpers";
import {
  Bell,
  MessageSquare,
  MapPin,
  Star,
  Tag,
  Eye,
  Power,
  Mail,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

export default function StepPreferences({
  form,
  update,
  onSave,
  onBack,
}: {
  form: ProviderForm;
  update: <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="step-preferences"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text)] flex items-center gap-2">
          <Eye className="w-6 h-6 text-[var(--primary)]" />
          Preferências & Visibilidade
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Ajuste como você será visto e notificado pelos clientes.
        </p>
      </div>

      {/* Grid de preferências */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PreferenceCard
          icon={<MessageSquare className="w-5 h-5 text-[var(--primary)]" />}
          title="Aceito propostas personalizadas"
          description="Permite que clientes enviem orçamentos sob medida."
        >
          <AnimatedToggle
            checked={form.acceptsCustomProposals}
            onChange={(v) => update("acceptsCustomProposals", v)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={<Bell className="w-7 h-7 text-[var(--primary)]" />}
          title="Notificações"
          description="Escolha como deseja ser avisado."
        >
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex gap-4 text-sm text-[var(--text)]"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications.email}
                onChange={(e) =>
                  update("notifications", {
                    ...form.notifications,
                    email: e.target.checked,
                  })
                }
              />
              Email
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifications.whatsapp}
                onChange={(e) =>
                  update("notifications", {
                    ...form.notifications,
                    whatsapp: e.target.checked,
                  })
                }
              />
              WhatsApp
            </label>
          </motion.div>
        </PreferenceCard>

        <PreferenceCard
          icon={<MapPin className="w-7 h-7 text-[var(--primary)]" />}
          title="Mostrar localização aproximada"
          description="Exibe sua área geral de atendimento, sem revelar endereço."
        >
          <AnimatedToggle
            checked={form.showApproxLocation}
            onChange={(v) => update("showApproxLocation", v)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={<Star className="w-5 h-5 text-[var(--primary)]" />}
          title="Permitir avaliações públicas"
          description="Deixe clientes deixarem comentários e estrelas."
        >
          <AnimatedToggle
            checked={form.allowReviews}
            onChange={(v) => update("allowReviews", v)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={<Tag className="w-5 h-5 text-[var(--primary)]" />}
          title="Exibir preços na página"
          description="Mostra valores estimados junto aos serviços."
        >
          <AnimatedToggle
            checked={form.showPrices}
            onChange={(v) => update("showPrices", v)}
          />
        </PreferenceCard>

        <PreferenceCard
          icon={<Power className="w-7 h-7 text-[var(--primary)]" />}
          title="Status"
          description="Defina se está disponível para novos contratos."
        >
          <motion.select
            whileTap={{ scale: 0.97 }}
            className="input rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-sm focus:border-[var(--primary)] transition-all duration-200"
            value={form.status}
            onChange={(e) => update("status", e.target.value as any)}
          >
            <option value="available">Disponível</option>
            <option value="paused">Pausado</option>
          </motion.select>
        </PreferenceCard>
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between mt-6 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
          <Bell className="w-4 h-4" />
          <span>Dicas de visibilidade aparecerão após salvar.</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------- */
/* SUBCOMPONENTES VISUAIS REUTILIZÁVEIS */
/* ---------------------------------- */

function PreferenceCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-[var(--text)]">{title}</p>
          {description && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

/* Toggle animado */
function AnimatedToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Toggle checked={checked} onChange={onChange} />
    </motion.div>
  );
}
