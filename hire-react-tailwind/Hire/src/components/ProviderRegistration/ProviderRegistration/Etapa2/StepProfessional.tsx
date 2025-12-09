

// StepProfessional.tsx — versão completa com sistema de disponibilidade inteligente
// ---------------------------------------------------------------------------------

import React from "react";
import { motion } from "framer-motion";
import type { Availability, DayKey, ProviderForm } from "../helpers/types-and-helpers";
import { TagInput, Toggle } from "../helpers/types-and-helpers";
import { Upload, Layers, Briefcase } from "lucide-react";

export default function StepProfessional({
  form,
  update,
  onPortfolioFiles,
  addSubcategory,
  removeSubcategory,
  portfolioPreviews,
}: {
  form: ProviderForm;
  update: <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => void;
  onPortfolioFiles: (files: FileList | null) => void;
  addSubcategory: (t: string) => void;
  removeSubcategory: (t: string) => void;
  portfolioPreviews: string[];
}) {
  const days: [DayKey, string][] = [
  ["monday", "Seg"],
  ["tuesday", "Ter"],
  ["wednesday", "Qua"],
  ["thursday", "Qui"],
  ["friday", "Sex"],
  ["saturday", "Sáb"],
  ["sunday", "Dom"],
];

  const mapLong = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  } as const;

  return (
    <motion.div
      layout
      className="flex flex-col gap-8"
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      {/* Cabeçalho */}
      <div>
        <h2 className="text-3xl font-semibold text-[var(--primary)] mb-1">
          Profissional & Serviços
        </h2>
        <p className="text-[var(--text-muted)] text-sm">
          Detalhe seus serviços e destaque seu nível profissional.
        </p>
      </div>

      <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl shadow-sm p-6 flex flex-col gap-6">
        
        {/* Nome e categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
              Nome comercial
            </label>
            <input
              className="input p-3 rounded-lg border-[var(--border)] bg-[var(--bg)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Ex: Studio Alpha ou João Serviços"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
              Categoria principal
            </label>
            <div className="relative">
              <Layers
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                className="input p-3 pl-9 rounded-lg border-[var(--border)] bg-[var(--bg)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all w-full"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="Ex: Beleza, Tecnologia..."
              />
            </div>
          </div>
        </div>

        {/* Subcategorias */}
        <div>
          <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
            Subcategorias / Serviços
          </label>
          <TagInput
            tags={form.subcategories}
            onAdd={addSubcategory}
            onRemove={removeSubcategory}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Separe diferentes tipos de serviço para facilitar sua busca.
          </p>
        </div>

        {/* Disponibilidade (Substitui preços e duração) */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-[var(--text-muted)]">
            Dias e horários de atendimento
          </label>

          {/* Botões de dias */}
          <div className="flex flex-wrap gap-2">
            {days.map(([key, label]) => {
              const active = !!form.availability[key];
              return (
                <button
                  key={key}
                  onClick={() =>
                    update("availability", {
                      ...form.availability,
                      [key]: active ? null : { start: "09:00", end: "18:00" },
                    })
                  }
                  className={
                    "px-3 py-1 rounded-lg text-sm border transition-all " +
                    (active
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)]")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Horários detalhados */}
          <motion.div layout className="flex flex-col gap-3">
            {(Object.entries(form.availability) as [DayKey, Availability[DayKey]][]).map(
              ([day, hours]) => {
              if (!hours) return null;
              return (
                <motion.div
                  key={day}
                  layout
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-light)] flex flex-col gap-2"
                >
                  <span className="font-medium text-sm capitalize">{mapLong[day]}</span>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Início */}
                    <div className="flex flex-col">
                      <label className="text-xs text-[var(--text-muted)]">Início</label>
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) =>
                          update("availability", {
                            ...form.availability,
                            [day]: { ...hours, start: e.target.value },
                          })
                        }
                        className="input p-2 rounded-lg border-[var(--border)] bg-[var(--bg)]"
                      />
                    </div>

                    {/* Fim */}
                    <div className="flex flex-col">
                      <label className="text-xs text-[var(--text-muted)]">Fim</label>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) =>
                          update("availability", {
                            ...form.availability,
                            [day]: { ...hours, end: e.target.value },
                          })
                        }
                        className="input p-2 rounded-lg border-[var(--border)] bg-[var(--bg)]"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Modos de atendimento */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Toggle
            checked={form.inPerson}
            onChange={(v) => update("inPerson", v)}
            label="Atendo presencialmente"
          />
          <Toggle
            checked={form.online}
            onChange={(v) => update("online", v)}
            label="Atendo online"
          />
        </div>

        {/* Link online condicional */}
        <motion.div
          layout
          initial={false}
          animate={{ opacity: form.online ? 1 : 0, height: form.online ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {form.online && (
            <div>
              <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
                Link para atendimentos online
              </label>
              <input
                className="input ml-2 p-2 rounded-lg border-[var(--border)] bg-[var(--bg)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                value={form.onlineLink}
                onChange={(e) => update("onlineLink", e.target.value)}
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}
        </motion.div>

        {/* Portfólio */}
        <div>
          <label className="text-sm font-medium text-[var(--text-muted)] mb-2">
            Portfólio (imagens / PDFs)
          </label>

          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--primary)] font-medium hover:underline">
              <Upload size={16} /> Adicionar arquivos
              <input
                type="file"
                multiple
                onChange={(e) => onPortfolioFiles(e.target.files)}
                className="hidden"
              />
            </label>
            <p className="text-xs text-[var(--text-muted)]">PNG, JPG, PDF — até 10 arquivos.</p>
          </div>

          <motion.div layout className="flex flex-wrap gap-3">
            {portfolioPreviews.map((url, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg)] shadow-sm"
              >
                <img src={url} alt={`portfolio-${i}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
