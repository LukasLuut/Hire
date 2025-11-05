import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * ContractViewer.tsx
 *
 * Props:
 *  - template: string (contrato com placeholders {{campo}})
 *  - data: Record<string,string> (valores para substituir placeholders)
 *  - platformInfo: { nome_plataforma, cnpj_plataforma, email_plataforma, cidade_forum }
 *  - onSigned?: (result) => void  // callback acionado quando assinado
 *
 * Como usar: ver exemplo no final do arquivo.
 */

/* --------------------
   Types
   -------------------- */
type PlatformInfo = {
  nome_plataforma: string;
  cnpj_plataforma?: string;
  email_plataforma?: string;
  cidade_forum?: string;
};

type ContractViewerProps = {
  template: string;
  data: Record<string, string>;
  platformInfo: PlatformInfo;
  /**
   * Called when the contract is successfully signed.
   * Receives:
   *  {
   *    finalHtml: string,
   *    pdfBlob: Blob,
   *    signature: { nameTyped, timestamp, userAgent, geolocation? },
   *    hash?: string (sha-256 hex of finalHtml)
   *  }
   */
  onSigned?: (payload: {
    finalHtml: string;
    pdfBlob: Blob | null;
    signature: {
      nameTyped: string;
      timestamp: string;
      userAgent: string;
      geolocation?: { latitude: number; longitude: number } | null;
    };
    hash?: string;
  }) => void;
};

/* --------------------
   Helpers
   -------------------- */
function replacePlaceholders(template: string, data: Record<string, string>, platform: PlatformInfo) {
  // merge platform into data with platform.* keys too
  const merged: Record<string, string> = { ...data };
  Object.entries(platform).forEach(([k, v]) => {
    if (v !== undefined) merged[k] = v;
  });

  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, key) => {
    const v = merged[key];
    return v !== undefined ? escapeHtml(v) : `{{${key}}}`;
  });
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function computeSHA256(text: string) {
  if (!("crypto" in window) || !crypto.subtle) return null;
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/* --------------------
   Component
   -------------------- */
export default function ContractViewer({ template, data, platformInfo, onSigned }: ContractViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [finalHtml, setFinalHtml] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [signing, setSigning] = useState(false);
  const [signatureMeta, setSignatureMeta] = useState<any>(null);
  const [shaHash, setShaHash] = useState<string | null>(null);
  const [geoAttempt, setGeoAttempt] = useState<{ latitude: number; longitude: number } | null>(null);

  // render HTML from template + data
  useEffect(() => {
    const html = replacePlaceholders(template, data, platformInfo);
    // simple wrapper with minimal inline styles for PDF readability (tailwind will apply on web)
    const wrapped = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height:1.35;">
        ${html}
      </div>
    `;
    setFinalHtml(wrapped);
    computeSHA256(wrapped).then((h) => setShaHash(h));
  }, [template, data, platformInfo]);

  // attempt to get geolocation (optional) when user focuses signature name input
  useEffect(() => {
    // we will call geolocation on demand (when user clicks sign) to avoid popups earlier
  }, []);

  const handleGeneratePdf = async (): Promise<Blob | null> => {
    if (!containerRef.current) return null;
    // use html2canvas to capture the container
    const el = containerRef.current;
    // temporarily remove interactive controls from view if needed (they should be outside)
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    // A4 size in pt: 595.28 x 841.89; we'll scale to fit width
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const w = imgWidth * ratio;
    const h = imgHeight * ratio;
    pdf.addImage(imgData, "PNG", (pageWidth - w) / 2, 20, w, h);
    const blob = pdf.output("blob");
    return blob;
  };

  const handleSign = async () => {
    if (!agree) {
      alert("Por favor, confirme que leu e concorda com os termos.");
      return;
    }
    if (!typedName || typedName.trim().length < 2) {
      alert("Por favor digite seu nome completo como assinatura.");
      return;
    }

    setSigning(true);

    // collect metadata
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;

    // attempt geolocation (optional)
    const geolocation = await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
      if (!("geolocation" in navigator)) return resolve(null);
      const geoTimeout = setTimeout(() => resolve(null), 8000); // timeout if takes too long
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(geoTimeout);
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        () => {
          clearTimeout(geoTimeout);
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 7000 }
      );
    });

    setGeoAttempt(geolocation);

    // generate final HTML with signature block
    const signatureBlock = `
      <div style="margin-top:24px;">
        <strong>Assinatura eletrônica:</strong><br/>
        Nome digitado: ${escapeHtml(typedName)}<br/>
        Data/Hora: ${escapeHtml(timestamp)}<br/>
        UserAgent: ${escapeHtml(userAgent)}<br/>
        Geolocalização: ${geolocation ? `${geolocation.latitude}, ${geolocation.longitude}` : "não disponível"}
      </div>
    `;
    const finalDocumentHtml = finalHtml + signatureBlock;

    // generate pdf
    // To include the signature block in the PDF we render the contract container as is (component includes signature area)
    const pdfBlob = await handleGeneratePdf();

    // compute hash of final HTML for audit
    const hash = await computeSHA256(finalDocumentHtml);

    const payload = {
      finalHtml: finalDocumentHtml,
      pdfBlob,
      signature: {
        nameTyped: typedName,
        timestamp,
        userAgent,
        geolocation,
      },
      hash: hash ?? undefined,
    };

    setSignatureMeta(payload.signature);
    setShaHash(hash ?? null);
    setSigning(false);

    // fire callback
    if (onSigned) onSigned(payload);

    // prompt download automatically
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contrato_${data["nome_contratante"] ?? "contratante"}_${new Date()
        .toISOString()
        .slice(0, 19)
        .replaceAll(":", "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      alert("Assinatura registrada — porém não foi possível gerar o PDF automaticamente.");
    }
  };

  /* --------------------
     Accessible UI
     -------------------- */
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Visualizar Contrato</h2>
        <div className="text-sm text-slate-600">Plataforma: {platformInfo.nome_plataforma}</div>
      </div>

      <div
        ref={containerRef}
        role="document"
        aria-label="Contrato de prestação de serviços"
        tabIndex={0}
        className="border rounded bg-white p-6 shadow-sm"
        // The inner HTML comes already escaped in replacePlaceholders
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />

      {/* Signature controls */}
      <div className="mt-6 bg-slate-50 p-4 rounded border">
        <fieldset>
          <legend className="text-sm font-medium mb-2">Assinatura eletrônica</legend>

          <div className="mb-3">
            <label className="block text-sm mb-1" htmlFor="typedName">
              Digite seu nome completo (assinatura)
            </label>
            <input
              id="typedName"
              aria-label="Nome completo para assinatura"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="Ex: João da Silva"
            />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="agree" className="text-sm">
              Li e concordo com os termos do contrato.
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSign}
              disabled={signing}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
              aria-disabled={signing}
            >
              {signing ? "Registrando assinatura..." : "Assinar e baixar PDF"}
            </button>

            <button
              type="button"
              onClick={async () => {
                const blob = await handleGeneratePdf();
                if (!blob) {
                  alert("Não foi possível gerar PDF.");
                  return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `contrato_preview.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 border rounded"
            >
              Baixar pré-visualização (PDF)
            </button>
          </div>
        </fieldset>

        {/* Signature metadata summary */}
        {signatureMeta && (
          <div className="mt-4 text-sm text-slate-700">
            <strong>Assinatura registrada:</strong>
            <div>Nome: {signatureMeta.nameTyped}</div>
            <div>Data/Hora: {signatureMeta.timestamp}</div>
            <div>UserAgent: {signatureMeta.userAgent}</div>
            <div>
              Geolocalização:{" "}
              {signatureMeta.geolocation ? `${signatureMeta.geolocation.latitude}, ${signatureMeta.geolocation.longitude}` : "não disponível"}
            </div>
            {shaHash && <div>Hash (SHA-256): <code className="break-all">{shaHash}</code></div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------
   Example usage:

   <ContractViewer
     template={CONTRACT_TEMPLATE} // see below or load from server
     data={{
       nome_contratante: "Fulano de Tal",
       cpf_contratante: "000.000.000-00",
       endereco_contratante: "Rua A, 123",
       email_contratante: "fulano@mail.com",
       telefone_contratante: "+55 11 9 0000-0000",
       nome_prestador: "Empresa X LTDA",
       cpf_prestador: "00.000.000/0001-00",
       endereco_prestador: "Av B, 456",
       descricao_servico: "Desenvolvimento de website institucional",
       prazo_execucao: "15 dias úteis",
       valor_servico: "3.500,00",
       valor_extenso: "três mil e quinhentos reais",
       forma_pagamento: "boleto / transferência",
       data_assinatura: "2025-10-19",
       cidade_assinatura: "São Paulo",
     }}
     platformInfo={{
       nome_plataforma: "MinhaPlataforma",
       cnpj_plataforma: "12.345.678/0001-90",
       email_plataforma: "suporte@minhaplataforma.com",
       cidade_forum: "São Paulo",
     }}
     onSigned={(payload) => {
       // envie ao backend -> salvar PDF, html, meta e hash para auditoria
       console.log("Assinado!", payload);
     }}
   />

   CONTRACT_TEMPLATE: use o modelo de contrato que te enviei anteriormente (com placeholders {{...}})
   -------------------- */
