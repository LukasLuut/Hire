// ProfilePreview.tsx — versão aprimorada com mais informações
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import type { ProviderForm, DayKey, Availability } from "../helpers/types-and-helpers";
import {
  ShieldCheck,
  FileText,
  MapPin,
  Briefcase,
  Map,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "../../../../interfaces/CategoryInterface";
import { categoryAPI } from "../../../../api/CategoryAPI";

export default function ProfilePreview({
  form,
  profilePreviewUrl,
}: {
  form: ProviderForm;
  profilePreviewUrl: string | null;
}) {
  const availability = form.availability;

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

  const [category, setCategory] = useState<Category>();

  useEffect( () => {
    const getCategory = async () => {
      const categoryGetted = await categoryAPI.getCategoryById(Number(form.category));

      if(categoryGetted) {
        setCategory(categoryGetted);
      }
    }

    getCategory();
   }, [form.category])

  return (
    <motion.div
      key="profile-preview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl p-5 shadow-md sticky top-20 flex flex-col gap-5 hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--bg)] border border-[var(--primary)] flex items-center justify-center">
          {profilePreviewUrl ? (
            <img src={profilePreviewUrl} alt="Foto do perfil" className="w-full h-full object-cover" />
          ) : (
            <div className="text-[var(--text-muted)] text-sm">Foto</div>
          )}
        </div>

        <div>
          <div className="text-base font-semibold text-[var(--text)]">
            {form.name || form.companyName || "Seu nome / empresa"}
          </div>
          <div className="text-sm text-[var(--text-muted)] flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-[var(--primary)]" />
            {category ? category.name : "Categoria"}
          </div>
        </div>
      </div>

      {/* Descrição */}
      <p className="text-sm text-[var(--text-muted)] line-clamp-4">
        {form.shortDescription || "Sua descrição curta aparecerá aqui..."}
      </p>

    

      {/* Subcategorias */}
      <div className="flex flex-wrap gap-2">
        {form.subcategories.length > 0 ? (
          form.subcategories.map((s, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-[var(--text)] hover:bg-[var(--primary)]/15 transition-colors duration-200"
            >
              {s}
            </span>
          ))
        ) : (
          <span className="text-xs text-[var(--text-muted)]">Nenhum serviço adicionado</span>
        )}
      </div>

      {/* Modelo de atendimento */}
      <div className="grid grid-cols-2 gap-3 text-center mt-2">
        <InfoCard icon={<Globe />} label="Atende online" value={form.online ? "Sim" : "Não"} />
        <InfoCard icon={<Map />} label="Presencial" value={form.inPerson ? "Sim" : "Não"} />
      </div>

      

      {/* Horários disponíveis */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="text-sm font-medium text-[var(--highlight)]">Disponibilidade semanal</div>

        {availabilityList.length > 0 ? (
          availabilityList.map(([key, label]) => {
            const slot = availability?.[key];
            if (!slot) return null;
            return (
              <div key={key} className="text-xs text-[var(--text)] flex justify-between bg-[var(--bg)] border border-[var(--border)] px-3 py-2 rounded-lg">
                <span className="font-medium">{label}</span>
                <span>
                  {slot.start} — {slot.end}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-[var(--text-muted)]">Nenhuma disponibilidade informada</div>
        )}
      </div>
      

      {/* Status */}
      <div className="flex flex-col gap-2 text-sm mt-2">
        <StatusLine
          icon={<ShieldCheck />}
          text={form.idDocument ? "Identidade verificada" : "Verificação pendente"}
          highlight={!!form.idDocument}
        />
        
        <StatusLine
          icon={<FileText />}
          text={
            form.certifications.length > 0
              ? `${form.certifications.length} certificado${form.certifications.length > 1 ? "s" : ""}`
              : "Nenhum certificado"
          }
          highlight={form.certifications.length > 0}
        />
        {/* Localização */}
        {form.address?.city && (
          <StatusLine icon={<MapPin />} text={`${form.address.city} - ${form.address.state ?? ""}`} highlight />
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------- Subcomponentes -------------------------- */

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
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-3 flex flex-col items-center justify-center hover:shadow-sm hover:scale-[1.02] transition-all duration-200">
      <div className="flex items-center gap-1 text-[var(--text-muted)] mb-1">
        {React.cloneElement(icon, {
          className: "w-4 h-4 text-[var(--primary)]",
        })}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-semibold text-[var(--highlight)] text-sm">{value}</div>
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
        className={`text-[var(--text)] ${highlight ? "font-medium text-[var(--highlight)]" : "text-[var(--text-muted)]"}`}
      >
        {text}
      </span>
    </div>
  );
}