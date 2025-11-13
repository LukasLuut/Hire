// ProviderRegistrationFull.tsx
// ============================================================================
// Cadastro de Prestador - Wizard completo (single-file)
// - React + TypeScript + TailwindCSS
// - Framer Motion para animações
// - Lucide React para ícones
// - Usa as variáveis de tema do seu projeto (var(--bg), var(--bg-light), var(--text), var(--primary), etc.)
// ============================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Camera,
  Upload,
  MapPin,
  ShieldCheck,
  FileText,
  Bell,
  Eye,
  X,
} from "lucide-react";

/* ===========================================================================
   Types - estrutura do formulário (um único objeto que agrupa as 5 etapas)
   =========================================================================== */
type FileOrNull = File | null;

type ProviderForm = {
  // Etapa 1 - Identidade
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  shortDescription: string;
  profilePhoto: FileOrNull;

  // Etapa 2 - Profissional/Serviços
  companyName: string;
  category: string;
  subcategories: string[]; // tags
  experienceLevel: "iniciante" | "intermediario" | "especialista" | "";
  priceRange: string;
  avgDuration: string;
  portfolio: File[]; // imagens / pdfs
  inPerson: boolean;
  online: boolean;
  onlineLink: string;

  // Etapa 3 - Endereço e atuação
  hasPhysicalLocation: boolean;
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    openingHours?: string;
  } | null;
  serviceRadiusKm: number;

  // Etapa 4 - Documentos & confiança
  idDocument?: FileOrNull;
  certifications: File[];
  links: string[];

  // Etapa 5 - Preferências & visibilidade
  acceptsCustomProposals: boolean;
  notifications: { email: boolean; whatsapp: boolean };
  showApproxLocation: boolean;
  allowReviews: boolean;
  showPrices: boolean;
  status: "available" | "paused";
};

/* ===========================================================================
   Estado inicial
   =========================================================================== */
const initialForm: ProviderForm = {
  name: "",
  cpfCnpj: "",
  email: "",
  phone: "",
  shortDescription: "",
  profilePhoto: null,

  companyName: "",
  category: "",
  subcategories: [],
  experienceLevel: "",
  priceRange: "",
  avgDuration: "",
  portfolio: [],
  inPerson: false,
  online: false,
  onlineLink: "",

  hasPhysicalLocation: false,
  address: null,
  serviceRadiusKm: 20,

  idDocument: null,
  certifications: [],
  links: [],

  acceptsCustomProposals: true,
  notifications: { email: true, whatsapp: false },
  showApproxLocation: true,
  allowReviews: true,
  showPrices: true,
  status: "available",
};

/* ===========================================================================
   Small UI helpers (inline components)
   - Toggle: styled switch
   - Tooltip: simple hover tooltip
   - TagInput: add/remove tags by Enter
   =========================================================================== */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  // Accessible switch-like element
  return (
    <label className="flex items-center gap-3 select-none">
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(!checked)}
        className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors cursor-pointer ${checked ? "bg-[var(--primary)]" : "bg-[var(--border-muted)]"}`}
      >
        <span className={`inline-block w-5 h-5 transform bg-[var(--bg-light)] rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </div>
      {label && <span className="text-[var(--text)] text-sm">{label}</span>}
    </label>
  );
}

function Tooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-block">
      <div className="text-xs text-[var(--text-muted)] underline decoration-dotted cursor-help">?</div>
      <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute z-20 -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-light)] border border-[var(--border)] text-[var(--text)] text-xs p-2 rounded shadow">
        {text}
      </div>
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }: { tags: string[]; onAdd: (t: string) => void; onRemove: (t: string) => void; placeholder?: string }) {
  const [value, setValue] = useState("");
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = value.trim();
      if (!v) return;
      if (!tags.includes(v)) onAdd(v);
      setValue("");
    }
  };
  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {tags.map((t) => (
          <span key={t} className="px-2 py-1 bg-[var(--bg)] border border-[var(--border)] rounded flex items-center gap-2 text-xs">
            <span>{t}</span>
            <button onClick={() => onRemove(t)} aria-label={`Remover ${t}`} className="text-[var(--text-muted)]">×</button>
          </span>
        ))}
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder ?? "Adicionar e pressionar Enter"}
        className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
      />
    </div>
  );
}

/* ===========================================================================
   Main Component - ProviderRegistrationFull
   - Single-file implementation including all steps and preview modal
   =========================================================================== */

export default function ProviderRegistrationFull() {
  // Step control (0..4)
  const [step, setStep] = useState<number>(0);
  const stepsCount = 5;

  // Global form data
  const [form, setForm] = useState<ProviderForm>(() => ({ ...initialForm }));

  // Preview helpers (urls for local previews)
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  // Mobile preview modal open
  const [previewOpen, setPreviewOpen] = useState(false);

  // Helper to update top-level fields
  const update = <K extends keyof ProviderForm>(key: K, value: ProviderForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // File handlers
  const handleProfilePhoto = (f: File | null) => {
    update("profilePhoto", f);
    if (f) setProfilePreviewUrl(URL.createObjectURL(f));
    else setProfilePreviewUrl(null);
  };

  const handlePortfolioFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    update("portfolio", [...form.portfolio, ...arr]);
    setPortfolioPreviews((p) => [...p, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const handleIdDocument = (f: File | null) => update("idDocument", f);
  const handleCertifications = (files: FileList | null) => {
    if (!files) return;
    update("certifications", [...form.certifications, ...Array.from(files)]);
  };

  // Tags helpers
  const addSubcategory = (tag: string) => {
    if (!tag) return;
    if (form.subcategories.includes(tag)) return;
    update("subcategories", [...form.subcategories, tag]);
  };
  const removeSubcategory = (tag: string) => update("subcategories", form.subcategories.filter((t) => t !== tag));

  // Navigation
  const next = () => setStep((s) => Math.min(s + 1, stepsCount - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Final submit (example building FormData)
  const handleSubmit = async () => {
    // build FormData to send files + fields
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("cpfCnpj", form.cpfCnpj || "");
    payload.append("phone", form.phone || "");
    payload.append("shortDescription", form.shortDescription || "");
    payload.append("companyName", form.companyName || "");
    payload.append("category", form.category || "");
    payload.append("priceRange", form.priceRange || "");
    payload.append("avgDuration", form.avgDuration || "");
    payload.append("inPerson", String(form.inPerson));
    payload.append("online", String(form.online));
    payload.append("onlineLink", form.onlineLink || "");
    payload.append("serviceRadiusKm", String(form.serviceRadiusKm));
    payload.append("acceptsCustomProposals", String(form.acceptsCustomProposals));
    payload.append("notifications", JSON.stringify(form.notifications));
    payload.append("showApproxLocation", String(form.showApproxLocation));
    payload.append("allowReviews", String(form.allowReviews));
    payload.append("showPrices", String(form.showPrices));
    payload.append("status", form.status);
    form.subcategories.forEach((s) => payload.append("subcategories[]", s));
    form.links.forEach((l) => payload.append("links[]", l));
    if (form.profilePhoto) payload.append("profilePhoto", form.profilePhoto);
    if (form.idDocument) payload.append("idDocument", form.idDocument);
    form.portfolio.forEach((f, i) => payload.append(`portfolio[${i}]`, f));
    form.certifications.forEach((f, i) => payload.append(`certifications[${i}]`, f));

    // Example axios send (commented)
    /*
    try {
      const res = await axios.post('/api/providers', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('Created', res.data);
    } catch (err) {
      console.error('Error', err);
    }
    */

    // For demo
    console.log("Form ready to send:", form);
    alert("Simulação de envio executada. Ver console.");
  };

  /* =========================================================================
     Layout: Grid with main wizard area and preview aside (desktop).
     On mobile preview is accessible via "Ver prévia" button that opens a modal.
     ========================================================================= */

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold">Cadastre seu perfil profissional</h1>
            <p className="text-[var(--text-muted)] mt-1">Guie-se pelo assistente — leva só alguns minutos.</p>
          </div>

          {/* Mobile preview button */}
          <div className="md:hidden">
            <button onClick={() => setPreviewOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--primary)] text-[var(--text)]">
              <Eye size={16} /> Ver prévia
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wizard area (left / main) */}
          <main className="md:col-span-2">
            {/* top progress */}
            <div className="mb-4">
              <div className="w-full h-2 bg-[var(--border-muted)] rounded-full overflow-hidden">
                <motion.div className="h-2 bg-[var(--primary)]" initial={{ width: 0 }} animate={{ width: `${((step + 1) / stepsCount) * 100}%` }} transition={{ duration: 0.4 }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-[var(--text-muted)]">
                <span>Etapa {step + 1} de {stepsCount}</span>
                <span className="font-medium">
                  {["Identidade", "Profissional", "Endereço", "Documentos", "Preferências"][step]}
                </span>
              </div>
            </div>

            {/* card with animated steps */}
            <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl p-6 shadow">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20, y: 0 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
                  {step === 0 && (
                    // Step 1 - Identity
                    <div className="flex flex-col gap-4">
                      <h2 className="text-2xl font-bold text-[var(--primary)]">1. Identidade & Conta</h2>
                      <p className="text-[var(--text-muted)]">Informações básicas para identificar você ou sua empresa.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Nome completo / Razão social</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: João Silva ou Studio ABC" value={form.name} onChange={(e) => update("name", e.target.value)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">CPF / CNPJ</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="000.000.000-00" value={form.cpfCnpj} onChange={(e) => update("cpfCnpj", e.target.value)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Email profissional</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="contato@empresa.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Telefone / WhatsApp</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="+55 (11) 9 9999-9999" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-[var(--text-muted)]">Descrição curta</label>
                        <textarea className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] resize-none" rows={3} placeholder="Diga em 1-2 frases o que te diferencia" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
                          {profilePreviewUrl ? <img src={profilePreviewUrl} alt="perfil" className="w-full h-full object-cover" /> : <Camera className="text-[var(--text-muted)]" />}
                        </div>

                        <div>
                          <label className="flex items-center gap-2 cursor-pointer text-[var(--primary)]">
                            <Upload size={16} /> Enviar foto
                            <input type="file" accept="image/*" onChange={(e) => handleProfilePhoto(e.target.files?.[0] ?? null)} className="hidden" />
                          </label>
                          <p className="text-xs text-[var(--text-muted)]">Use logo ou foto profissional</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    // Step 2 - Professional
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-[var(--primary)]">2. Profissional & Serviços</h2>
                          <p className="text-[var(--text-muted)]">Descreva seus serviços, portfólio e modo de atendimento.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip text="Use tags para listar os serviços que você oferece" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Nome comercial (opcional)</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: Studio XYZ" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Categoria principal</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: Beleza, Tecnologia" value={form.category} onChange={(e) => update("category", e.target.value)} />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-[var(--text-muted)]">Subcategorias / Serviços</label>
                          <TagInput tags={form.subcategories} onAdd={addSubcategory} onRemove={removeSubcategory} placeholder="Ex: Corte, Coloração..." />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Nível de experiência</label>
                          <select className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.experienceLevel} onChange={(e) => update("experienceLevel", e.target.value as any)}>
                            <option value="">Selecione</option>
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="especialista">Especialista</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Faixa de preço média (R$)</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: 100 - 300" value={form.priceRange} onChange={(e) => update("priceRange", e.target.value)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Duração média</label>
                          <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: 01:30" value={form.avgDuration} onChange={(e) => update("avgDuration", e.target.value)} />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-4">
                          <Toggle checked={form.inPerson} onChange={(v) => update("inPerson", v)} label="Atendo presencialmente" />
                          <Toggle checked={form.online} onChange={(v) => update("online", v)} label="Atendo online" />
                        </div>

                        {form.online && (
                          <div className="md:col-span-2">
                            <label className="text-sm text-[var(--text-muted)]">Link para atendimentos online</label>
                            <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="https://meet.google.com/..." value={form.onlineLink} onChange={(e) => update("onlineLink", e.target.value)} />
                          </div>
                        )}

                        <div className="md:col-span-2">
                          <label className="text-sm text-[var(--text-muted)]">Portfólio (imagens / PDFs)</label>
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer text-[var(--primary)]">
                              <Upload size={16} /> Adicionar
                              <input type="file" multiple onChange={(e) => handlePortfolioFiles(e.target.files)} className="hidden" />
                            </label>
                            <p className="text-xs text-[var(--text-muted)]">PNG, JPG, PDF — recomendamos até 10 arquivos</p>
                          </div>

                          <div className="flex gap-2 mt-3 flex-wrap">
                            {portfolioPreviews.map((u, i) => <img key={i} src={u} alt={`pf-${i}`} className="w-20 h-20 object-cover rounded border border-[var(--border)]" />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    // Step 3 - Address
                    <div className="flex flex-col gap-4">
                      <h2 className="text-2xl font-bold text-[var(--primary)]">3. Endereço & Área de Atuação</h2>
                      <p className="text-[var(--text-muted)]">Endereço é opcional — atenda online ou em raio.</p>

                      <div className="flex items-center gap-4">
                        <Toggle checked={form.hasPhysicalLocation} onChange={(v) => update("hasPhysicalLocation", v)} label="Tenho local físico de atendimento" />
                        <Tooltip text="Ative para adicionar endereço completo e fotos do local." />
                      </div>

                      {form.hasPhysicalLocation ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm text-[var(--text-muted)]">CEP</label>
                            <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.address?.cep || ""} onChange={(e) => update("address", { ...(form.address || {}), cep: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm text-[var(--text-muted)]">Rua / Número</label>
                            <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.address?.street || ""} onChange={(e) => update("address", { ...(form.address || {}), street: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm text-[var(--text-muted)]">Bairro</label>
                            <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.address?.neighborhood || ""} onChange={(e) => update("address", { ...(form.address || {}), neighborhood: e.target.value })} />
                          </div>
                          <div>
                            <label className="text-sm text-[var(--text-muted)]">Cidade / Estado</label>
                            <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.address?.city || ""} onChange={(e) => update("address", { ...(form.address || {}), city: e.target.value })} />
                          </div>

                          <div className="md:col-span-2">
                            <div className="border border-[var(--border)] rounded p-3 flex items-center gap-3">
                              <MapPin />
                              <div>
                                <div className="text-sm text-[var(--text)] font-medium">Mapa (integração opcional)</div>
                                <div className="text-xs text-[var(--text-muted)]">Integre Google Maps / Leaflet com pin arrastável aqui.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Raio de atuação (km)</label>
                          <input type="number" min={1} max={500} className="w-32 p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.serviceRadiusKm} onChange={(e) => update("serviceRadiusKm", Number(e.target.value))} />
                          <p className="text-xs text-[var(--text-muted)] mt-1">Ex: 20 → atende até 20km</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-[var(--text-muted)]">Horário de funcionamento (opcional)</label>
                        <input className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" placeholder="Ex: Seg–Sex 9:00–18:00" value={form.address?.openingHours || ""} onChange={(e) => update("address", { ...(form.address || {}), openingHours: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    // Step 4 - Documents
                    <div className="flex flex-col gap-4">
                      <h2 className="text-2xl font-bold text-[var(--primary)]">4. Documentos & Confiança</h2>
                      <p className="text-[var(--text-muted)]">Envie documentos para ganhar selos e credibilidade.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Documento de identificação</label>
                          <input type="file" onChange={(e) => handleIdDocument(e.target.files?.[0] ?? null)} />
                          <p className="text-xs text-[var(--text-muted)] mt-1">RG / CNH / CNPJ</p>
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Certificações / Cursos (opcional)</label>
                          <input type="file" multiple onChange={(e) => handleCertifications(e.target.files)} />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-sm text-[var(--text-muted)]">Links profissionais</label>
                          <LinkList links={form.links} onAdd={(l) => update("links", [...form.links, l])} onRemove={(i) => update("links", form.links.filter((_, idx) => idx !== i))} />
                        </div>
                      </div>

                      <div className="flex gap-3 items-center mt-3">
                        <Badge label="Identidade verificada" enabled={!!form.idDocument} icon={<ShieldCheck />} />
                        <Badge label="Documentos enviados" enabled={form.certifications.length > 0} icon={<FileText />} />
                        <Badge label="Perfil completo" enabled={!!form.name && !!form.category && !!form.profilePhoto} icon={<CheckCircle />} />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    // Step 5 - Preferences
                    <div className="flex flex-col gap-4">
                      <h2 className="text-2xl font-bold text-[var(--primary)]">5. Preferências & Visibilidade</h2>
                      <p className="text-[var(--text-muted)]">Ajuste como você quer aparecer para clientes.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Aceitar propostas personalizadas</label>
                          <Toggle checked={form.acceptsCustomProposals} onChange={(v) => update("acceptsCustomProposals", v)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Notificações</label>
                          <div className="flex gap-3 items-center">
                            <label className="flex items-center gap-2"><input type="checkbox" checked={form.notifications.email} onChange={(e) => update("notifications", { ...form.notifications, email: e.target.checked })} /> Email</label>
                            <label className="flex items-center gap-2"><input type="checkbox" checked={form.notifications.whatsapp} onChange={(e) => update("notifications", { ...form.notifications, whatsapp: e.target.checked })} /> WhatsApp</label>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Exibir localização aproximada</label>
                          <Toggle checked={form.showApproxLocation} onChange={(v) => update("showApproxLocation", v)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Permitir avaliações públicas</label>
                          <Toggle checked={form.allowReviews} onChange={(v) => update("allowReviews", v)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Exibir preços na página</label>
                          <Toggle checked={form.showPrices} onChange={(v) => update("showPrices", v)} />
                        </div>

                        <div>
                          <label className="text-sm text-[var(--text-muted)]">Status</label>
                          <select className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" value={form.status} onChange={(e) => update("status", e.target.value as any)}>
                            <option value="available">Disponível</option>
                            <option value="paused">Pausado</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3 text-[var(--text-muted)]"><Bell /> <span className="text-sm">Dicas para melhorar sua visibilidade aparecerão aqui.</span></div>
                        <div className="flex gap-3">
                          <button onClick={() => prev()} className="px-4 py-2 border border-[var(--border)] rounded">Voltar</button>
                          <button onClick={() => handleSubmit()} className="px-4 py-2 bg-[var(--primary)] text-[var(--text)] rounded">Salvar & Publicar</button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* bottom nav (desktop/mobile) */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  {step > 0 && <button onClick={() => prev()} className="px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] flex items-center gap-2"><ArrowLeft size={16} /> Voltar</button>}
                </div>
                <div>
                  {step < stepsCount - 1 ? (
                    <button onClick={() => next()} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--text)] flex items-center gap-2">Próximo <ArrowRight size={16} /></button>
                  ) : null}
                </div>
              </div>
            </div>
          </main>

          {/* Preview aside (desktop) */}
          <aside className="hidden md:block">
            <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl p-4 sticky top-6 w-72">
              <ProfilePreviewCard form={form} profilePreviewUrl={profilePreviewUrl} />
            </div>
          </aside>
        </div>
      </div>

      {/* Preview modal (mobile) */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-md bg-[var(--bg-light)] rounded-2xl p-4 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Prévia do Perfil</h3>
                <button onClick={() => setPreviewOpen(false)} className="p-1 rounded hover:bg-[var(--border)]"><X /></button>
              </div>
              <ProfilePreviewCard form={form} profilePreviewUrl={profilePreviewUrl} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===========================================================================
   Subcomponents inside the same file (for study). You can move each to its own file later.
   - TagInput is above.
   - LinkList, Badge, ProfilePreviewCard below.
   =========================================================================== */

function LinkList({ links, onAdd, onRemove }: { links: string[]; onAdd: (l: string) => void; onRemove: (i: number) => void }) {
  const [val, setVal] = useState("");
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="https://linkedin.com/..." className="w-full p-2 rounded border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]" />
        <button onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(""); } }} className="px-3 py-2 bg-[var(--primary)] text-[var(--text)] rounded">Adicionar</button>
      </div>
      <div className="flex flex-col gap-2">
        {links.map((l, i) => (
          <div key={i} className="flex items-center justify-between bg-[var(--bg)] p-2 rounded border border-[var(--border)] text-xs">
            <div className="truncate">{l}</div>
            <button onClick={() => onRemove(i)} className="text-[var(--text-muted)]">Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ label, enabled, icon }: { label: string; enabled: boolean; icon?: React.ReactNode }) {
  return (
    <div className={`px-3 py-2 rounded-lg flex items-center gap-2 border ${enabled ? "border-[var(--primary)] bg-[var(--bg)]" : "border-[var(--border)] bg-[var(--bg)]"}`}>
      <div className={`${enabled ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>{icon}</div>
      <div className={`text-xs ${enabled ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>{label}</div>
    </div>
  );
}

function ProfilePreviewCard({ form, profilePreviewUrl }: { form: ProviderForm; profilePreviewUrl: string | null }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center">
          {profilePreviewUrl ? <img src={profilePreviewUrl} alt="profile" className="w-full h-full object-cover" /> : <Camera className="text-[var(--text-muted)]" />}
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">{form.name || form.companyName || "Seu nome / empresa"}</div>
          <div className="text-xs text-[var(--text-muted)]">{form.category || "Categoria"}</div>
        </div>
      </div>

      <p className="text-sm text-[var(--text-muted)] mt-3 line-clamp-4">{form.shortDescription || "Descrição curta aparecerá aqui..."}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[var(--bg)] p-2 rounded border border-[var(--border)] text-center">
          <div className="font-semibold text-[var(--primary)]">{form.priceRange || "—"}</div>
          <div className="text-[var(--text-muted)]">Preço</div>
        </div>
        <div className="bg-[var(--bg)] p-2 rounded border border-[var(--border)] text-center">
          <div className="font-semibold text-[var(--primary)]">{form.avgDuration || "—"}</div>
          <div className="text-[var(--text-muted)]">Duração</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {form.subcategories.length > 0 ? form.subcategories.map((s, i) => <span key={i} className="px-2 py-1 text-xs rounded bg-[var(--primary)]/10 border border-[var(--border)]">{s}</span>) : <span className="text-xs text-[var(--text-muted)]">Sem serviços</span>}
      </div>

      <div className="mt-4 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2"><ShieldCheck /> {form.idDocument ? "Identidade enviada" : "Verificação pendente"}</div>
        <div className="flex items-center gap-2 mt-2"><FileText /> {form.certifications.length > 0 ? `${form.certifications.length} certificados` : "Nenhum certificado"}</div>
      </div>

      <div className="mt-4 text-xs text-[var(--text-muted)] flex items-center justify-between">
        <div>Visibilidade</div>
        <div>{form.status === "available" ? "Disponível" : "Pausado"}</div>
      </div>
    </div>
  );
}

/* ===========================================================================
   End of file - instruções para refatoração:
   - Cada Step (step === 0..4) pode virar seu próprio componente em /components/Provider/steps
   - Badge, ProfilePreviewCard, TagInput, Toggle, LinkList podem ser extraídos para /components/ui
   - Integre validação com zod/react-hook-form depois para comportamento "pronto pra produção"
   =========================================================================== */
