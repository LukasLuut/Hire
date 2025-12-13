import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { MapPin, Map, Loader2 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Toggle } from "../helpers/types-and-helpers";
import type { ProviderForm } from "../helpers/types-and-helpers";

export default function StepAddress({
  form,
  update,
}: {
  form: ProviderForm;
  update: <K extends keyof ProviderForm>(k: K, v: ProviderForm[K]) => void;
}) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [position, setPosition] = useState<[number, number]>([-23.5505, -46.6333]);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Estados locais para inputs
  const [cep, setCep] = useState(form.address?.cep || "");
  const [street, setStreet] = useState(form.address?.street || "");
  const [number, setNumber] = useState(form.address?.number || "");
  const [neighborhood, setNeighborhood] = useState(form.address?.neighborhood || "");
  const [city, setCity] = useState(form.address?.city || "");
  const [state, setState] = useState(form.address?.state || "");

  const lastCepSearchedRef = useRef<string | null>(null);

  // Limpa CEP
  const cleanCep = (c: string) => c.replace(/\D/g, "");



  // CEP automático
  useEffect(() => {
    const numericCep = cleanCep(cep);
    if (numericCep.length !== 8) return;
    if (numericCep === lastCepSearchedRef.current) return;

    lastCepSearchedRef.current = numericCep;

    fetch(`https://viacep.com.br/ws/${numericCep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) return;

        // Atualiza estados locais
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
        setState(data.uf || "");

        // Atualiza form somente se houver mudanças
        const current = form.address || {};
        if (
          current.cep !== cep ||
          current.street !== data.logradouro ||
          current.neighborhood !== data.bairro ||
          current.city !== data.localidade ||
          current.state !== data.uf
        ) {
          update("address", {
            ...current,
            cep,
            street: data.logradouro || "",
            number: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          });
        }

        // Inicio do mapa, revisar ainda
        const query = `${data.logradouro || ""}, ${data.bairro || ""}, ${data.localidade || ""}, ${data.uf || ""}, Brasil`;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((loc) => {
            if (loc.length > 0) {
              const lat = parseFloat(loc[0].lat);
              const lon = parseFloat(loc[0].lon);
              setPosition([lat, lon]);
            }
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, [cep]);

  // Atualiza form manualmente no blur
  const handleBlur = () => {
  
    if(!cep || cep.trim() == "") {
      alert("CEP INVÁLIDO");
      return;
    }
  
    update("address", {
      ...(form.address || {}),
      cep,
      street,
      neighborhood,
      number,
      city,
      state,
    });
  };

  function maskCEP(value: string) {
  return value
    .replace(/\D/g, '')          // remove tudo que não for número
    .replace(/^(\d{5})(\d)/, '$1-$2') // coloca o hífen
    .slice(0, 9);                // limita em 9 caracteres
}


  return (
    <motion.div
      key="step-address"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6 max-w-3xl"
    >
      <div>
        <h2 className="text-2xl font-semibold text-[var(--text)] flex items-center gap-2">
          <MapPin className="w-6 h-6 text-[var(--primary)]" />
          Endereço & Área de Atuação
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Defina se você atende em um local físico ou em um raio de alcance.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <Toggle
          checked={form.hasPhysicalLocation}
          onChange={(v) => update("hasPhysicalLocation", v)}
          label="Tenho local físico de atendimento"
        />
        <p className="text-xs text-[var(--text-muted)] sm:ml-2">
          Ative para adicionar endereço completo e visualizar no mapa.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {form.hasPhysicalLocation ? (
          <motion.div
            key="physical"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-md overflow-hidden"
          >
            <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <Input label="CEP" value={cep} placeholder="00000-000" onChange={(value) => setCep(maskCEP(value))} onBlur={handleBlur} />
              <Input label="Rua" value={street} placeholder="Rua, número" onChange={setStreet} onBlur={handleBlur} />
              <Input label="Número" value={number} placeholder="Número" onChange={setNumber} onBlur={handleBlur} />
              <Input label="Bairro" value={neighborhood} placeholder="Bairro" onChange={setNeighborhood} onBlur={handleBlur} />
              <Input
                label="Cidade / Estado"
                value={city && state ? `${city} - ${state}` : city}
                placeholder="Cidade - Estado"
                onChange={setCity}
                onBlur={handleBlur}
              />
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--surface-elevated)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Map className="w-5 h-5 text-[var(--primary)]" />
                <span className="text-sm font-medium text-[var(--text)]">Visualização do mapa</span>
              </div>

              {loadingLocation ? (
                <div className="flex items-center justify-center h-52">
                  <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
                  <span className="text-xs text-[var(--text-muted)] ml-2">Buscando localização...</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[var(--text-muted)] mb-2">
                    O mapa mostra sua cidade atual. Você pode mover o marcador para ajustar.
                  </p>
                  <div ref={mapContainerRef} className="w-full h-56  rounded-xl border bg-[var(--bg)] border-[var(--border)] overflow-hidden"></div>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="radius"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="bg-[var(--bg)] flex  flex-col border border-[var(--border)] rounded-2xl shadow-md p-6 max-w-sm"
          >
            <label className="text-sm text-[var(--text-muted)]">Raio de atuação (km)</label>
            <input
              type="number"
              className="input w-20 rounded-md px-3 bg-[var(--bg-light)] mt-2"
              value={form.serviceRadiusKm || ""}
              onChange={(e) => update("serviceRadiusKm", Number(e.target.value))}
              placeholder="Ex: 20"
            />
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Exemplo: 20 → você atende até 20 km da sua cidade base.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onBlur?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-[var(--text-muted)] font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="input bg-[var(--bg)]  border border-[var(--border)] rounded-xl text-[var(--text)] placeholder:text-[var(--text-muted)] px-3 py-2 focus:border-[var(--primary)] transition-all duration-200"
      />
    </div>
  );
}
