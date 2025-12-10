// types-and-helpers.tsx
// ---------------------
// Tipos e pequenos componentes/helpers reutilizáveis.
//  pode importar estes em todos os steps.

import React, { useState } from "react";

/* -----------------------------
   Tipos principais do formulário
   ----------------------------- */
interface Service {
  id: number;
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  price?: string;
  duration?: string;
  featured?: boolean;
  status?: string;
  images: string[];
  likes?: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;

  // telefone sempre padronizado no projeto
  phone?: string;

  // endereço segue o mesmo padrão usado no StepAddress
  address?: {
    street: string;
    number?: string;
    neighborhood?: string;
    city: string;
    state: string;
    cep?: string;
    complement?: string;
    lat?: number;
    lng?: number;
  };

  // favoritos (prestadores salvos)
  favorites?: string[]; // IDs de prestadores

  // pedidos feitos como cliente
  orders?: string[];

  // status de verificação (mesma lógica do prestador)
  verification?: {
    emailVerified: boolean;
    phoneVerified: boolean;
    documentVerified?: boolean;
  };

  // indica se ele já ativou o modo prestador
  isProvider: boolean;

  createdAt: string;
  updatedAt?: string;
}


export type FileOrNull = File | null ;

// Tipagens corrigidas para evitar erro de indexação e any implícito
export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type DayAvailability = {
  start: string;
  end: string;
};

export type Availability = Record<DayKey, DayAvailability | null>;

// Interface ProviderForm atualizada
export interface ProviderForm {
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  shortDescription: string;
  profilePhoto: FileOrNull;

  companyName: string;
  category: string;
  subcategories: string[];
  experienceLevel?: "iniciante" | "intermediario" | "especialista" | "";
  portfolio: File[];
  portfolioPreviews?: string[];

  availability: Availability;

  inPerson: boolean;
  online: boolean;
  onlineLink: string;

  hasPhysicalLocation: boolean;
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
  } | null;
  serviceRadiusKm?: number;

  idDocument?: FileOrNull;
  certifications: File[];
  links: string[];

  acceptsCustomProposals: boolean;
  notifications: { email: boolean; whatsapp: boolean };
  showApproxLocation: boolean;
  allowReviews: boolean;
  showPrices: boolean;
  status: "available" | "paused";
}




/* -----------------------------
   Small UI helpers (Toggle, TagInput)
   ----------------------------- */

// Toggle (switch) — bonito e acessível
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
          checked ? "bg-[var(--primary)]" : "bg-[var(--border-muted)]"
        }`}
      >
        <span
          className={`inline-block w-5 h-5 transform bg-[var(--bg-light)] rounded-full transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </div>
      {label && <span className="text-[var(--text)] text-sm">{label}</span>}
    </label>
  );
}

// TagInput — adicionado por Enter, removível
export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = "Adicionar e pressionar Enter",
}: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input.trim();
      if (!v) return;
      onAdd(v);
      setInput("");
    }
  };
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((t) => (
          <span key={t} className="px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded flex items-center gap-2 text-xs">
            {t}
            <button onClick={() => onRemove(t)} className="text-[var(--text-muted)]">×</button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
      />
    </div>
  );
}

// LinkList — permite adicionar e remover links profissionais (LinkedIn, Behance, etc.)
export function LinkList({
  links,
  onAdd,
  onRemove,
  placeholder = "Cole o link e pressione Enter",
}: {
  links: string[];
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.trim();
      if (!value) return;

      // Adiciona o link com validação básica
      const isValidUrl = value.startsWith("http://") || value.startsWith("https://");
      if (!isValidUrl) {
        alert("Insira um link válido (com http:// ou https://)");
        return;
      }

      onAdd(value);
      setInput("");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {links.map((link) => (
          <div
            key={link}
            className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] px-2 py-1 rounded"
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--highlight)] text-sm underline truncate max-w-[160px]"
            >
              {link.replace(/^https?:\/\//, "").split("/")[0]}
            </a>
            <button
              onClick={() => onRemove(link)}
              className="text-[var(--text-muted)] hover:text-red-500 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleAdd}
        placeholder={placeholder}
        className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
      />
    </div>
  );
}