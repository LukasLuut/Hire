
// ---------------------------------
// Container principal: gerencia estado, navegação e submit.


import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";


import { type ProviderForm, type FileOrNull } from "../helpers/types-and-helpers";
import StepIdentity from "../Etapa1/StepIdentity";
import StepProfessional from "../Etapa2/StepProfessional";
import StepAddress from "../Etapa3/StepAddress";
import StepDocuments from "../Etapa4/StepDocuments";
import StepPreferences from "../Etapa5/StepPreferences";
import ProfilePreview from "../ProfilePreview/ProfilePreview";


export default function ProviderRegistrationContainer() {
  const [step, setStep] = useState<number>(0);
  const totalSteps = 5;
  const initialForm: ProviderForm = {
  // ---------------------------
  //  Identidade e Conta
  // ---------------------------
  name: "Lucas William",
  cpfCnpj: "033.046.990-82",
  email: "lucas.william@Hire.com",
  phone: "(51) 98765-4321",
  shortDescription: "Profissional dedicado com foco em qualidade e atendimento personalizado.",
  profilePhoto: null, // Substituir por File ou URL futuramente

  // ---------------------------
  //  Profissional e Serviços
  // ---------------------------
  companyName: "Reformas William",
  category: "Construção Civil",
  subcategories: ["Pintura", "Elétrica", "Reparos gerais"],
  experienceLevel: "especialista",
  portfolio: [], // Substituir futuramente por array de serviços
  priceRange: "R$ 150,00 - R$ 500,00",
  avgDuration: "1 a 3 horas",
  inPerson: true,
  online: false,
  onlineLink: "",

  // ---------------------------
  //  Endereço e Área de Atuação
  // ---------------------------
  hasPhysicalLocation: true,
  address: {
    cep: "93120-520",
    street: "Rua Elsa Dauber Steimer",
    number: "67",
    neighborhood: "Scharlau",
    city: "São Leopoldo",
    state: "RS",
  },
  serviceRadiusKm: 25,

  // ---------------------------
  //  Documentos e Confiança
  // ---------------------------
  idDocument: null, // Arquivo de RG/CPF/CNPJ
  certifications: [], // Certificados, cursos, etc.
  links: [
    "https://www.instagram.com/reformaswilliam",
    "https://www.linkedin.com/in/lucaswilliam",
  ],

  // ---------------------------
  //  Preferências e Visibilidade
  // ---------------------------
  acceptsCustomProposals: true,
  notifications: {
    email: true,
    whatsapp: true,
  },
  showApproxLocation: true,
  allowReviews: true,
  showPrices: true,
  status: "available", // "paused" se estiver sem agenda
};


  const [form, setForm] = useState<ProviderForm>(() => ({ ...initialForm }));
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  const update = <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  /* file handlers */
  const handleProfileFile = (f: FileOrNull) => {
    update("profilePhoto", f);
    if(typeof f !== "string"){
        if (f) setProfilePreviewUrl(URL.createObjectURL(f));
    }
    else setProfilePreviewUrl(f);
  };

  const handlePortfolioFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    update("portfolio", [...form.portfolio, ...arr]);
    setPortfolioPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  };

  const handleIdDocument = (f: File | null) => update("idDocument", f);
  const handleCertifications = (files: FileList | null | File[]) => {
    if (!files) return;
    update("certifications", [...form.certifications, ...Array.from(files)]);
  };

  const addSubcategory = (t: string) => {
    if (!t) return;
    if (form.subcategories.includes(t)) return;
    update("subcategories", [...form.subcategories, t]);
  };
  const removeSubcategory = (t: string) => update("subcategories", form.subcategories.filter((s) => s !== t));

  /* navigation */
  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* submit (reaproveite o handleFinish do bloco anterior para enviar FormData) */
  const handleFinish = async () => {
    // montagem FormData e envio via axios aqui (comentado)
    console.log("Submitting: ", form);
    alert("Simulação: formulário enviado. Ver console.");
  };

  /* render step switch */
  const StepView = () => {
    switch (step) {
      case 0:
        return <StepIdentity form={form} update={update} profilePreviewUrl={profilePreviewUrl} onProfileFile={handleProfileFile} />;
      case 1:
        return <StepProfessional form={form} update={update} onPortfolioFiles={handlePortfolioFiles} addSubcategory={addSubcategory} removeSubcategory={removeSubcategory} portfolioPreviews={portfolioPreviews} />;
      case 2:
        return <StepAddress form={form} update={update} />;
      case 3:
        return <StepDocuments form={form} update={update} onIdDocument={handleIdDocument} onCertifications={handleCertifications} />;
      case 4:
        return <StepPreferences form={form} update={update} onSave={handleFinish} onBack={prev} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Cadastro de Prestador</h1>
            <p className="text-sm text-[var(--text-muted)]">Monte sua vitrine profissional em poucos passos</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* progress */}
            <div className="mb-4">
              <div className="w-full h-2 bg-[var(--border-muted)] rounded-full overflow-hidden">
                <motion.div className="h-2 bg-[var(--primary)]" initial={{ width: 0 }} animate={{ width: `${((step + 1) / totalSteps) * 100}%` }} transition={{ duration: 0.4 }} />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-[var(--text-muted)]">
                <span>Etapa {step + 1} de {totalSteps}</span>
                <span className="font-medium">{["Identidade","Profissional","Endereço","Documentos","Preferências"][step]}</span>
              </div>
            </div>

            <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl p-6 shadow-md">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35 }}>
                  <StepView />
                </motion.div>
              </AnimatePresence>

              {/* mobile nav + desktop bottom nav */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  {step > 0 && (
                    <button onClick={prev} className="px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] flex items-center gap-2">
                      <ArrowLeft size={16} /> Voltar
                    </button>
                  )}
                </div>
                <div>
                  {step < totalSteps - 1 ? (
                    <button onClick={next} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--white)] flex items-center gap-2">
                      Próximo <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button onClick={handleFinish} className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--white)] flex items-center gap-2">
                      Salvar & Publicar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* preview: lateral on md, below on mobile due to grid ordering */}
          <aside className="order-first md:order-last">
            <ProfilePreview form={form} profilePreviewUrl={profilePreviewUrl} />
          </aside>
        </div>
      </div>
    </div>
  );
}
