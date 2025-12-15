// ProviderHero.tsx — Hero institucional refatorado (responsivo)
// ------------------------------------------------------

import React from "react";
import { motion } from "framer-motion";
import type { ProviderForm, DayKey } from "../ProviderRegistration/ProviderRegistration/helpers/types-and-helpers";
import {
  Building2,
  Briefcase,
  Globe,
  Map,
  Clock,
  ShieldCheck,
  FileText,
  MapPin,
  Star,
} from "lucide-react";

interface ProviderHeroProps {
  provider: ProviderForm;
}

export default function ProviderHero({ provider }: ProviderHeroProps) {
  const availability = provider.availability;

  const days: [DayKey, string][] = [
    ["monday", "Segunda"],
    ["tuesday", "Terça"],
    ["wednesday", "Quarta"],
    ["thursday", "Quinta"],
    ["friday", "Sexta"],
    ["saturday", "Sábado"],
    ["sunday", "Domingo"],
  ];

  const availabilityList = days.filter(([key]) => availability?.[key]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mt-4 md:mt-6 mb-8 md:mb-10 bg-[var(--bg-dark)] px-4 sm:px-6 py-6 text-[var(--text)] border-t border-[var(--border)]"
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar / Logo */}
          <div className="w-28 h-28 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full bg-[var(--bg)] border border-[var(--primary)] flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-[var(--primary)]" />
          </div>

          {/* Info principal */}
          <div className="flex items-center md:items-start flex-col gap-2">
            <div className="flex flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold leading-tight">
                {provider.companyName || provider.name}
              </h2>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold">4.8</span>
                <span className="text-[var(--text-muted)]">(35 avaliações)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Briefcase className="w-4 h-4 text-[var(--primary)]" />
              <span>{provider.category || "Categoria não informada"}</span>
            </div>

            <h2 className="mt-2 ml-3 text-[var(--bg-dark)] md:text-[var(--text)]">Sobre</h2>
            {provider.shortDescription && (
              <p className="mt-3 md:ml-3  max-w-2xl text-sm text-[var(--text-muted)] leading-relaxed">
                {provider.shortDescription}
              </p>
            )}

            {provider.subcategories?.length > 0 && (
              <div className="flex md:ml-3 flex-wrap gap-2 mt-2">
                {provider.subcategories.map((sub, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm border ${
              provider.status === "available"
                ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
            }`}
          >
            {provider.status === "available"
              ? "Aberto"
              : "Agenda fechada"}
          </span>

          {provider.experienceLevel && (
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm border border-[var(--border)]">
              Nível {provider.experienceLevel}
            </span>
          )}
        </div>
      </div>

      {/* MODELO DE ATENDIMENTO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        <InfoCard icon={<Globe />} label="Atendimento Online" value={provider.online ? "Disponível" : "—"} />
        <InfoCard icon={<Map />} label="Atendimento Presencial" value={provider.inPerson ? "Disponível" : "—"} />
        <InfoCard
          icon={<Clock />}
          label="Agenda"
          value={availabilityList.length > 0 ? "Semanal" : "Sob consulta"}
        />
        <InfoCard
          icon={<Briefcase />}
          label="Propostas"
          value={provider.acceptsCustomProposals ? "Flexíveis" : "Escopo fixo"}
        />
      </div>

      {/* DISPONIBILIDADE */}
      <div className="mt-6">
        <div className="text-sm font-medium text-[var(--highlight)] mb-2">
          Disponibilidade semanal
        </div>

        {availabilityList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availabilityList.map(([key, label]) => {
              const slot = availability?.[key];
              if (!slot) return null;
              return (
                <div
                  key={key}
                  className="flex justify-between text-xs bg-[var(--bg)] border border-[var(--border)] px-3 py-2 rounded-lg"
                >
                  <span className="font-medium">{label}</span>
                  <span>
                    {slot.start} — {slot.end}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-[var(--text-muted)]">
            Nenhuma disponibilidade informada
          </div>
        )}
      </div>

      {/* CONFIANÇA */}
      <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col gap-2 text-sm">
        <StatusLine
          icon={<ShieldCheck />}
          text={provider.idDocument ? "Identidade verificada" : "Verificação pendente"}
          highlight={!!provider.idDocument}
        />

        <StatusLine
          icon={<FileText />}
          text={
            provider.certifications.length > 0
              ? `${provider.certifications.length} certificado${provider.certifications.length > 1 ? "s" : ""}`
              : "Nenhum certificado informado"
          }
          highlight={provider.certifications.length > 0}
        />

        {provider.address?.city && (
          <StatusLine
            icon={<MapPin />}
            text={`Atendimento regional • ${provider.address.city}/${provider.address.state ?? ""}`}
            highlight
          />
        )}
      </div>
    </motion.section>
  );
}

/* ---------------- Subcomponentes ---------------- */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 flex flex-col items-center justify-center">
      <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
        {React.cloneElement(icon, {
          className: "w-4 h-4 text-[var(--primary)]",
        })}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-medium text-[var(--highlight)] text-sm">
        {value}
      </div>
    </div>
  );
}

function StatusLine({
  icon,
  text,
  highlight,
}: {
  icon: React.ReactElement<{ className?: string }>;
  text: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
        {React.cloneElement(icon, {
          className: "w-3.5 h-3.5 text-[var(--primary)]",
        })}
      </div>
      <span
        className={`text-sm ${highlight ? "font-medium text-[var(--highlight)]" : "text-[var(--text-muted)]"}`}
      >
        {text}
      </span>
    </div>
  );
}
