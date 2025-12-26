// ---------------------------------
// Container principal: gerencia estado, navegação e submit.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toFiles } from "../helpers/file-helpers";
import {
  type ProviderForm,
  type FileOrNull,
} from "../helpers/types-and-helpers";

import StepIdentity from "../Etapa1/StepIdentity";
import StepProfessional from "../Etapa2/StepProfessional";
import StepAddress from "../Etapa3/StepAddress";
import StepDocuments from "../Etapa4/StepDocuments";
import StepPreferences from "../Etapa5/StepPreferences";
import ProfilePreview from "../ProfilePreview/ProfilePreview";
import { addressAPI } from "../../../../api/AddressAPI";
import type { Address } from "../../../../interfaces/AddressInterface";
import { providerApi } from "../../../../api/ProviderAPI";
import { validateFormData } from "../../../../validate/validateFormData";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProviderRegistrationContainer({ isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState<number>(0);
  const totalSteps = 5;

   // Fecha com ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initialForm: ProviderForm = {
  // Identidade
  name: "Lucas William",
  cnpj: "",
  professionalEmail: "lucas.william@Hire.com",
  professionalPhone: "51984584293",
  shortDescription:
    "Profissional dedicado com foco em qualidade e atendimento personalizado.",
  profilePhoto: null,

  // Profissional
  companyName: "Reformas William",
  category: "",
  subcategories: ["Pintura", "Elétrica", "Reparos gerais"],
  experienceLevel: "especialista",
  portfolio: [],
  inPerson: true,
  online: false,
  onlineLink: "",
  
  // ✅ NOVO
  availability: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  },

  // Endereço
  hasPhysicalLocation: true,
  address: {
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  },
  serviceRadiusKm: 25,

  // Documentos
  idDocument: null,
  certifications: [],
  links: [
    "https://www.instagram.com/reformaswilliam",
    "https://www.linkedin.com/in/lucaswilliam",
  ],

  // Preferências
  acceptsCustomProposals: true,
  notifications: { email: true, whatsapp: true },
  showApproxLocation: true,
  allowReviews: true,
  showPrices: true,
  status: "available",
};


  const [form, setForm] = useState<ProviderForm>(() => ({ ...initialForm }));
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(
    null
  );
  const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);

  /* update */
  const update = <K extends keyof ProviderForm>(
    k: K,
    v: ProviderForm[K]
  ) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  /* file handlers */
  const handleProfileFile = (f: FileOrNull) => {
    update("profilePhoto", f);
    if (typeof f !== "string") {
      if (f) setProfilePreviewUrl(URL.createObjectURL(f));
    } else setProfilePreviewUrl(f);
  };

  const handlePortfolioFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    update("portfolio", [...form.portfolio, ...arr]);
    setPortfolioPreviews((prev) => [
      ...prev,
      ...arr.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleIdDocument = (f: File | null) => update("idDocument", f);
  
  const handleCertifications = (files: FileList | File[] | null) => {
  if (!files) return;

  const normalized = Array.isArray(files)
    ? files
    : toFiles(files);

  update("certifications", [
    ...form.certifications,
    ...normalized,
  ]);
};

  const addSubcategory = (t: string) => {
    if (!t) return;
    if (form.subcategories.includes(t)) return;
    update("subcategories", [...form.subcategories, t]);
  };

  const removeSubcategory = (t: string) =>
    update("subcategories", form.subcategories.filter((s) => s !== t));

  function validateAddress() {
    if (!form.address?.cep || form.address.cep.trim() === "" || form.address.cep.length !== 9) { alert("Coloque um CEP válido"); return null}
    if (!form.address?.street || form.address.street.trim() === "") { alert("Rua é obrigatório"); return null}
    if (!form.address?.number || form.address.number.trim() === "") { alert("Número é obrigatório"); return null}
    if (!form.address?.neighborhood || form.address.neighborhood.trim() === "") { alert("Bairro é obrigatório"); return null}
    if (!form.address?.city || form.address.city.trim() === "") { alert("Cidade é obrigatório"); return null}
    if (!form.address?.state || form.address.state.trim() === "") { alert("Estado é obrigatório"); return null}

    return true;
  }
  /* navigation */
  const next = () => {

    if(!validateFormData(form, step)) {
      return;
    }

    if(step == 2) {
      if (!validateAddress()) return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1))
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  /* submit */
  const handleFinish = async () => {

    const token = localStorage.getItem("token");
    if(!token) return;

    const formData = new FormData();

    formData.append("companyName", form.companyName);
    formData.append("professionalName", form.name);
    formData.append("professionalEmail", form.professionalEmail);
    formData.append("professionalPhone", form.professionalPhone);
    formData.append("description", form.shortDescription);
    formData.append("cnpj", form.cnpj ? form.cnpj : "");
    formData.append("subcategories", JSON.stringify(form.subcategories));
    formData.append("attendsPresent", JSON.stringify(form.inPerson));
    formData.append("attendsOnline", JSON.stringify(form.online));
    formData.append("personalizedProposals", JSON.stringify(form.acceptsCustomProposals));
    formData.append("approximateLocation", JSON.stringify(form.showApproxLocation));
    formData.append("publicReviews", JSON.stringify(form.allowReviews));
    formData.append("pricesOnPage", JSON.stringify(form.showPrices));
    formData.append("whatsNotification", JSON.stringify(form.notifications.whatsapp));
    formData.append("emailNotification", JSON.stringify(form.notifications.email));
    formData.append("status", form.status);
    formData.append("onlineLink", form.onlineLink);
    formData.append("links", JSON.stringify(form.links));
    formData.append("availabilities", JSON.stringify(form.availability));
    formData.append("image", form.profilePhoto ? form.profilePhoto : "");

    providerApi.create(formData, token);

    const address: Address = {
      id: 0,
      num: form.address?.number,
      street: form.address?.street,
      neighborhood: form.address?.neighborhood,
      city: form.address?.city,
      state: form.address?.state,
      country: "Brazi",
      postalCode: form.address?.cep
    }
   addressAPI.create(address, token);

    console.log("Submitting: ", form);
    alert("Simulação: formulário enviado. Ver console.");
    onClose();
  };

  useEffect(() => {
    console.log(form)
  }, [form])

  return (
    <div className="min-h-auto bg-[var(--bg-dark)] text-[var(--text)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Cadastro de Prestador</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Monte sua vitrine profissional em poucos passos
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* progress */}
            <div className="mb-4">
              <div className="w-full h-2 bg-[var(--border-muted)] rounded-full overflow-hidden">
                <motion.div
                  className="h-2 bg-[var(--primary)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((step + 1) / totalSteps) * 100}%`,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-[var(--text-muted)]">
                <span>
                  Etapa {step + 1} de {totalSteps}
                </span>
                <span className="font-medium">
                  {["Identidade", "Profissional", "Endereço", "Documentos", "Preferências"][step]}
                </span>
              </div>
            </div>

            {/* ====================================== */}
            {/*   🔥 ETAPAS COM ANIMATEPRESENCE CORRETO */}
            {/* ====================================== */}
            <div className="bg-[var(--bg-light)] border border-[var(--border)] rounded-2xl p-6 shadow-md">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StepIdentity
                      form={form}
                      update={update}
                      profilePreviewUrl={profilePreviewUrl}
                      onProfileFile={handleProfileFile}
                    />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StepProfessional
                      form={form}
                      update={update}
                      onPortfolioFiles={handlePortfolioFiles}
                      addSubcategory={addSubcategory}
                      removeSubcategory={removeSubcategory}
                      portfolioPreviews={portfolioPreviews}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StepAddress form={form} update={update} />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StepDocuments
                      form={form}
                      update={update}
                      onIdDocument={handleIdDocument}
                      onCertifications={handleCertifications}
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                  >
                    <StepPreferences
                      form={form}
                      update={update}
                      onSave={handleFinish}
                      onBack={prev}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* nav */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  {step > 0 && (
                    <button
                      onClick={prev}
                      className="px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Voltar
                    </button>
                  )}
                </div>

                <div>
                  {step < totalSteps - 1 ? (
                    <button
                      onClick={next}
                      className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--white)] flex items-center gap-2"
                    >
                      Próximo <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      className="px-4 py-2 rounded bg-[var(--primary)] text-[var(--white)] flex items-center gap-2"
                    >
                      Salvar & Publicar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* preview */}
          <aside className="order-first md:order-last">
            <ProfilePreview form={form} profilePreviewUrl={profilePreviewUrl} />
          </aside>
        </div>
      </div>
    </div>
  );
}
