// StepDocuments.tsx — versão aprimorada com UI/UX do StepAddress
// --------------------------------------------------------------

import React from "react";
import type { ProviderForm } from "../helpers/types-and-helpers";
import { ShieldCheck, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { LinkList } from "../helpers/types-and-helpers";
import { toFiles } from "../helpers/file-helpers";


export default function StepDocuments({
  form,
  update,
  onIdDocument,
  onCertifications,
}: {
  form: ProviderForm;
  update: <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => void;
  onIdDocument: (f: File | null) => void;
  onCertifications: (files: File[] | null) => void;
}) {
  return (
    <motion.div
      key="step-documents"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 max-w-3xl"
    >
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text)] flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
          Documentos & Confiança
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Envie documentos, certificações e links profissionais para ganhar selos e confiança.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Documento de Identificação */}
        <FileUploadCard
          label="Documento de identificação"
          description="RG / CNH / CNPJ"
          icon={<ShieldCheck className="w-5 h-5" />}
          file={form.idDocument}
          onChange={(f) => onIdDocument(f as File | null)}
        />

        {/* Certificações */}
        <FileUploadCard
          label="Certificações (opcional)"
          description="Faça upload de certificados profissionais"
          icon={<FileText className="w-5 h-5" />}
          multiple
          files={form.certifications}
          onChange={(files) =>
            onCertifications(Array.isArray(files) ? (files as File[]) : null)
          }
        />

        {/* Links profissionais */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--text-muted)]">
            Links profissionais
          </label>

          <div className="mt-2">
            <LinkList
              links={form.links}
              onAdd={(url) => update("links", [...form.links, url])}
              onRemove={(url) =>
                update("links", form.links.filter((l) => l !== url))
              }
            />
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-4 mt-4">
        <Badge icon={<ShieldCheck />} active={!!form.idDocument} />
        <Badge icon={<FileText />} active={form.certifications.length > 0} />
      </div>
    </motion.div>
  );
}


// Card de upload de arquivos
function FileUploadCard({
  label,
  description,
  icon,
  file,
  files,
  onChange,
  multiple = false,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  file?: File | null;
  files?: File[] | null;
  onChange: (f: File | null | File[] | null) => void;
  multiple?: boolean;
}) {
  return (
    <label className="group cursor-pointer border border-[var(--border)] rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-all bg-[var(--bg)]">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium text-[var(--text)]">{label}</span>
          <span className="text-xs text-[var(--text-muted)]">{description}</span>
        </div>
      </div>

      <span className="text-xs  text-[var(--text-muted)] mt-2">
        {multiple
          ? files?.length
            ? `${files.length} arquivo(s) selecionado(s)`
            : "Clique para selecionar arquivos"
          : file
          ? file.name
          : "Clique para selecionar um arquivo"}
      </span>

      <input
        type="file"
        className="hidden"
        multiple={multiple}
        onChange={(e) => {
          if (multiple) {
            const fileList = toFiles(e.target.files);
            onChange(fileList.length ? fileList : null);
          } else {
            onChange(e.target.files?.[0] ?? null);
          }
        }}
      />
    </label>
  );
}


// Badge de status
function Badge({ icon, active }: { icon: React.ReactNode; active: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center justify-center w-12 h-12 rounded-lg border transition-all ${
        active
          ? "border-[var(--primary)] bg-[var(--primary)]/10"
          : "border-[var(--border)] bg-[var(--bg)]"
      }`}
    >
      <div
        className={`${
          active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
        }`}
      >
        {icon}
      </div>
    </motion.div>
  );
}
