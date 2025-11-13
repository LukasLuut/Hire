// StepIdentity.tsx
// -----------------
// Etapa 1 — Identidade & Conta (UI refinada + UX aprimorada)

import React from "react";
import type { ProviderForm } from "../helpers/types-and-helpers";
import type { FileOrNull } from "../helpers/types-and-helpers";
import { Camera, Upload } from "lucide-react";

export default function StepIdentity({
  form,
  update,
  profilePreviewUrl,
  onProfileFile,
}: {
  form: ProviderForm;
  update: <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => void;
  profilePreviewUrl: string | null;
  onProfileFile: (f: FileOrNull) => void;
}) {
  return (
    <div className="flex flex-col gap-10 animate-fadeIn">
      {/* ======================= */}
      {/* Cabeçalho da Etapa */}
      {/* ======================= */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
          Sua Identidade Profissional
        </h2>
        <p className="text-[var(--text-muted)] text-sm md:text-base mt-1">
          Comece criando a base do seu perfil — essas informações ajudam seus clientes a te reconhecerem.
        </p>
      </div>

      {/* ======================= */}
      {/* Card Principal */}
      {/* ======================= */}
      <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl shadow-lg p-8 md:p-10 transition-all hover:shadow-[0_0_25px_-5px_var(--primary)/20]">

        {/* Upload com preview */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-[var(--border)] pb-8">
          <div className="relative group">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-dashed border-[var(--border)] bg-[var(--bg)] flex items-center justify-center group-hover:border-[var(--primary)] transition-all">
              {profilePreviewUrl ? (
                <img
                  src={profilePreviewUrl}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="text-[var(--text-muted)]" size={40} />
              )}
            </div>

            {/* Botão de upload no hover */}
            <label className="absolute inset-0 rounded-full flex items-end justify-center text-xs font-medium text-[var(--bg-light)] bg-[var(--primary)] bg-opacity-0 group-hover:bg-opacity-80 opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
              <div className="pb-2 flex items-center gap-1">
                <Upload size={12} /> Alterar
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onProfileFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-[var(--text)] mb-1">
              Apresente-se de forma profissional
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              Sua foto ou logotipo aumenta a confiança dos clientes.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Dica: use uma imagem nítida, com fundo neutro ou seu logotipo.
            </p>
          </div>
        </div>

        {/* Campos principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nome completo / Empresa"
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="Ex: João Silva ou Studio ABC"
          />

          <InputField
            label="CPF / CNPJ"
            value={form.cpfCnpj}
            onChange={(v) => update("cpfCnpj", v)}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
          />

          <InputField
            label="Email profissional"
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="contato@empresa.com"
          />

          <InputField
            label="Telefone / WhatsApp"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="+55 (11) 9 9999-9999"
          />
        </div>

        {/* Descrição curta */}
        <div className="mt-6">
          <label className="text-sm font-medium text-[var(--text-muted)] mb-2 block">
            Descrição curta
          </label>
          <textarea
            className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] h-28 resize-none focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            placeholder="Diga em 1–2 frases o que você faz melhor..."
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Uma boa descrição aumenta suas chances de aparecer nas buscas.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Componente auxiliar para os campos (InputField)
   ============================================================ */
function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-[var(--text-muted)] mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
      />
    </div>
  );
}
