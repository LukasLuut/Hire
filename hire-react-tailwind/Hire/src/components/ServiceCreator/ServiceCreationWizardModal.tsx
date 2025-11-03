/* --------------------------------------------------------------------------
 * ServiceCreationWizardModal.tsx
 *
 * Modal de Criação de Serviço
 * -------------------------------------------------
 * - Multietapas com animações (framer-motion)
 * - Upload e ordenação de imagens (drag & drop)
 * - Switches modernos para opções booleanas
 * - Tooltips e placeholders informativos
 * - Layout aprimorado e responsivo
 * - Estrutura pronta para envio via API com axios (comentada)
 * -------------------------------------------------------------------------- */

import { useState} from "react";
import type { ChangeEvent } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, Info } from "lucide-react";
// import axios from "axios"; // ← pronto para integração futura

/* --------------------------------------------------------------------------
 * Tipagem dos dados do formulário
 * -------------------------------------------------------------------------- */
interface ServiceFormData {
  images: File[];
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: number | "";
  negotiable: boolean;
  duration: string;
  requiresScheduling: boolean;
  cancellationNotice: string;
  acceptedTerms: boolean;
}

/* --------------------------------------------------------------------------
 * Categorias disponíveis (exemplo estático)
 * -------------------------------------------------------------------------- */
const categories = [
  { name: "Design", subcategories: ["Logotipo", "Web", "Ilustração"] },
  { name: "Programação", subcategories: ["Frontend", "Backend", "Mobile"] },
  { name: "Consultoria", subcategories: ["Marketing", "Financeiro"] },
];

/* --------------------------------------------------------------------------
 * Tooltip simples para instruções curtas
 * -------------------------------------------------------------------------- */
const Tooltip = ({ text }: { text: string }) => (
  <motion.div
    className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <Info size={12} /> {text}
  </motion.div>
);

/* --------------------------------------------------------------------------
 * Switch estilizado (melhor UX)
 * -------------------------------------------------------------------------- */
const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
      checked ? "bg-[var(--primary)]" : "bg-[var(--border-muted)]"
    }`}
  >
    <span
      className={`inline-block w-5 h-5 transform bg-[var(--text)] rounded-full transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

/* --------------------------------------------------------------------------
 * Componente principal
 * -------------------------------------------------------------------------- */
export const ServiceCreationWizardModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  /* --------------------------------------------------------------------------
   * Estados
   * -------------------------------------------------------------------------- */
  const [formData, setFormData] = useState<ServiceFormData>({
    images: [],
    category: "",
    subcategory: "",
    title: "",
    description: "",
    price: "",
    negotiable: false,
    duration: "",
    requiresScheduling: false,
    cancellationNotice: "",
    acceptedTerms: false,
  });

  const [step, setStep] = useState(0);
  const [imageList, setImageList] = useState<File[]>([]);
  const progressPercentage = ((step + 1) / 9) * 100;

  /* --------------------------------------------------------------------------
   * Manipuladores de eventos
   * -------------------------------------------------------------------------- */
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 8));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImageList((prev) => [...prev, ...filesArray]);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...filesArray] }));
  };

  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* --------------------------------------------------------------------------
   * Submissão (comentada para futura integração com API)
   * --------------------------------------------------------------------------
   * async function handleSubmit() {
   *   try {
   *     const formDataToSend = new FormData();
   *     Object.entries(formData).forEach(([key, value]) => {
   *       if (Array.isArray(value)) {
   *         value.forEach((file) => formDataToSend.append("images", file));
   *       } else {
   *         formDataToSend.append(key, value.toString());
   *       }
   *     });
   *     await axios.post("/api/services", formDataToSend);
   *   } catch (error) {
   *     console.error("Erro ao enviar serviço:", error);
   *   }
   * }
   * -------------------------------------------------------------------------- */

  // -----------------------------------------------------------------------------
  // Componente: ServicePreview
  // -----------------------------------------------------------------------------
  // Este componente exibe um *preview* (pré-visualização) do serviço que o usuário
  // está criando no wizard. Ele mostra as informações preenchidas (como título,
  // descrição, preço etc.) e também permite reordenar e remover imagens.
  // -----------------------------------------------------------------------------

 // ---------------------------------------------------------------------------
// Componente de pré-visualização do serviço
// Mostra um "card" com as informações preenchidas no formulário, incluindo
// imagem de capa, descrição e dados principais. Agora inclui a função "Ver mais".
// ---------------------------------------------------------------------------
const ServicePreview = (
) => {
  // Estado local para controlar se a descrição está expandida
  const [expanded, setExpanded] = useState(false);

  // Limite de caracteres antes de aparecer o botão "Ver mais"
  const charLimit = 220;

  // Verifica se a descrição ultrapassa o limite
  const isLongText = formData.description && formData.description.length > charLimit;

  // Define o texto visível com base no estado "expanded"
  const displayedText = isLongText
    ? expanded
      ? formData.description
      : formData.description.slice(0, charLimit) + "..."
    : formData.description;

  return (
    // motion.div -> componente animado do Framer Motion (anima entrada)
    <motion.div
      className="p-4 rounded-lg shadow-xl w-full relative text-[var(--text)] overflow-hidden"

      // Fundo: primeira imagem enviada (ou transparente se não houver)
      style={{
        backgroundImage: imageList[0]
          ? `url(${URL.createObjectURL(imageList[0])})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Camada translúcida para garantir legibilidade do conteúdo */}
      <div className="bg-[var(--bg-light)]/90 p-4 rounded backdrop-blur-sm">
        {/* -------------------- TÍTULO -------------------- */}
        <h2 className="font-bold text-2xl mb-2 text-[var(--primary)]">
          {formData.title || "Título do serviço"}
        </h2>

        {/* -------------------- DESCRIÇÃO -------------------- */}
        <p className="text-[var(--text-muted)] mb-2">
          {displayedText || "Descrição do serviço..."}
        </p>

        {/* Botão “Ver mais / Ver menos” aparece apenas se o texto for longo */}
        {isLongText && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-[var(--primary)] text-sm hover:underline focus:outline-none"
          >
            {expanded ? "Ver menos" : "Ver mais"}
          </button>
        )}

        {/* -------------------- CATEGORIA -------------------- */}
        <p>
          <strong>Categoria:</strong> {formData.category || "-"} /{" "}
          {formData.subcategory || "-"}
        </p>

        {/* -------------------- PREÇO -------------------- */}
        <p>
          <strong>Preço:</strong>{" "}
          {formData.price ? `R$ ${formData.price}` : "-"}{" "}
          {formData.negotiable && "(Negociável)"}
        </p>

        {/* -------------------- DURAÇÃO -------------------- */}
        <p>
          <strong>Duração:</strong> {formData.duration || "-"}
        </p>

        {/* -------------------- CANCELAMENTO (se exigir agendamento) -------------------- */}
        {formData.requiresScheduling && (
          <p>
            <strong>Cancelamento:</strong>{" "}
            {formData.cancellationNotice || "-"}
          </p>
        )}

        {/* ---------------------------------------------------------------------
            GALERIA DE IMAGENS (com suporte a drag & drop via Reorder.Group)
           --------------------------------------------------------------------- */}
        <div className="flex gap-2 flex-wrap mt-3">
          <Reorder.Group
            axis="x"
            values={imageList}
            onReorder={setImageList}
            className="flex gap-2 flex-wrap"
          >
            {imageList.map((img, i) => (
              <Reorder.Item key={i} value={img}>
                <div className="relative cursor-grab">
                  {/* Miniatura da imagem */}
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />

                  {/* Botão para remover imagem */}
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-[var(--danger)] text-white rounded-full p-1 hover:bg-[var(--danger)]/80"
                  >
                    <X size={12} />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>
    </motion.div>
  );
};

  /* --------------------------------------------------------------------------
 * Conteúdo de cada etapa do wizard de criação de serviço
 * --------------------------------------------------------------------------
 * - Cada etapa representa um "passo" do processo de cadastro de serviço.
 * - Os tooltips (componente <Tooltip />) aparecem abaixo dos campos e dão
 *   dicas úteis para o usuário preencher corretamente.
 * - O objetivo é guiar o usuário passo a passo de forma fluida e intuitiva.
 * -------------------------------------------------------------------------- */

const stepsContent = [

  /* ------------------------------------------------------------------------
   *   ETAPA 0 — UPLOAD DE IMAGENS
   * ------------------------------------------------------------------------
   * O usuário adiciona imagens que representam seu serviço.
   * A primeira imagem será usada como capa no preview.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--bg-dark)]">
    <label className="text-[var(--text)] font-semibold">Adicione imagens do serviço</label>
    <Tooltip text="A primeira imagem será usada como capa do serviço" />
    
    {/* Input nativo para múltiplas imagens */}
    <input
      type="file"
      multiple
      onChange={handleImageUpload}
      className="text-[var(--text)]"
    />

    {/* Exibe a pré-visualização apenas se houver imagens */}
    {imageList.length > 0 && <ServicePreview />}
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 1 — CATEGORIA PRINCIPAL
   * ------------------------------------------------------------------------
   * O usuário seleciona a área principal do serviço 
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <label className="text-[var(--text)] font-semibold">Categoria</label>
    <Tooltip text="Escolha a área principal em que seu serviço se enquadra" />

    <select
      name="category"
      value={formData.category}
      onChange={handleInputChange}
      className="border rounded p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
    >
      <option className="overflow-hidden w-10" value="">Selecione uma categoria</option>
      {categories.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 2 — SUBCATEGORIA
   * ------------------------------------------------------------------------
   * Mostra opções dependentes da categoria escolhida.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <label className="text-[var(--text)] font-semibold">Subcategoria</label>
    <Tooltip text="Ajuda a especificar melhor o tipo de serviço oferecido" />

    <select
      name="subcategory"
      value={formData.subcategory}
      onChange={handleInputChange}
      disabled={!formData.category} // só habilita se já tiver categoria
      className="border rounded w-full p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
    >
      <option  value="">Selecione</option>
      {formData.category &&
        categories
          .find((c) => c.name === formData.category)!
          .subcategories.map((sub) => (
            <option  key={sub} value={sub}>
              {sub}
            </option>
          ))}
    </select>
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 3 — TÍTULO E DESCRIÇÃO
   * ------------------------------------------------------------------------
   * O título e descrição para o cliente entender o serviço.
   * Placeholders e tooltips para orientar o usuário.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <label className="text-[var(--text)] font-semibold">Título do serviço</label>
    <Tooltip text="Escolha um nome curto e direto. Exemplo: 'Criação de Logotipo Profissional'" />
    <input
      type="text"
      name="title"
      value={formData.title}
      placeholder="Ex: Criação de Logotipo Profissional"
      onChange={handleInputChange}
      className="border rounded p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
    />

    <label className="text-[var(--text)] mt-5 font-semibold">Descrição</label>
    <Tooltip text="Descreva seu serviço, incluindo o que está incluso e como funciona." />
    <textarea
      name="description"
      value={formData.description}
      placeholder="Descreva seu serviço com detalhes..."
      onChange={handleInputChange}
      className="border rounded p-2 border-[var(--border)] min-h-30 bg-[var(--bg-light)] text-[var(--text)]"
    />
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 4 — VALOR DO SERVIÇO
   * ------------------------------------------------------------------------
   * Aqui o usuário define o preço e se ele é negociável.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <label className="text-[var(--text)] font-semibold">Preço</label>
    <Tooltip text="Informe o valor padrão do serviço. Deixe vazio se for sob orçamento." />
    <input
      type="number"
      name="price"
      value={formData.price}
      placeholder="Ex: 250"
      onChange={handleInputChange}
      className="border rounded p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
    />

    {/* Switch para indicar valor negociável */}
    <div className="flex items-center gap-2 mt-1">
      <span className="text-[var(--text)]">Valor negociável</span>
      <Switch
        checked={formData.negotiable}
        onChange={() =>
          setFormData((prev) => ({ ...prev, negotiable: !prev.negotiable }))
        }
      />
    </div>
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 5 — DURAÇÃO MÉDIA
   * ------------------------------------------------------------------------
   * Define quanto tempo o serviço leva em média.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <label className="text-[var(--text)] font-semibold">Duração média</label>
    <Tooltip text="Informe o tempo médio para realização do serviço. Exemplo: 02:00 (2 horas)" />
    <input
      type="text"
      name="duration"
      value={formData.duration}
      placeholder="Ex: 01:30"
      onChange={handleInputChange}
      className="border rounded p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
    />
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 6 — AGENDAMENTO
   * ------------------------------------------------------------------------
   * Caso o serviço exija agendamento prévio, o usuário pode definir
   * o prazo mínimo de cancelamento.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className="text-[var(--text)]">Necessita agendamento?</span>
      <Switch
        checked={formData.requiresScheduling}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            requiresScheduling: !prev.requiresScheduling,
          }))
        }
      />
    </div>
    <Tooltip text="Ative se o cliente precisar marcar data e horário." />

    {/* Campo extra aparece apenas se o switch estiver ativo */}
    {formData.requiresScheduling && (
      <>
        <label className="text-[var(--text)] font-semibold">Prazo para cancelamento</label>
        <input
          type="text"
          name="cancellationNotice"
          value={formData.cancellationNotice}
          placeholder="Ex: até 24h antes"
          onChange={handleInputChange}
          className="border rounded p-2 border-[var(--border)] bg-[var(--bg-light)] text-[var(--text)]"
        />
      </>
    )}
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA 7 — ACEITE DE TERMOS
   * ------------------------------------------------------------------------
   * Confirmação de que o usuário aceita os termos de uso da plataforma.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-2">
    <p className="text-[var(--text-muted)]">
      Antes de publicar, confirme que leu e aceita os termos da plataforma.
    </p>
    <div className="flex items-center gap-2">
      <span className="text-[var(--text)]">Aceito os termos</span>
      <Switch
        checked={formData.acceptedTerms}
        onChange={() =>
          setFormData((prev) => ({ ...prev, acceptedTerms: !prev.acceptedTerms }))
        }
      />
    </div>
  </div>,

  /* ------------------------------------------------------------------------
   *   ETAPA FINAL — PRÉ-VISUALIZAÇÃO
   * ------------------------------------------------------------------------
   * Mostra o serviço montado visualmente antes da publicação.
   * O botão de publicação está pronto para integração com a API.
   * ------------------------------------------------------------------------ */
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold text-[var(--text)]">Pré-visualização</h2>
    <Tooltip text="Confira como seu serviço será exibido aos clientes." />
    <ServicePreview />

    {/* Botão de publicação
        - Quando for integrar com a API, basta descomentar a linha handleSubmit.
        - Exemplo de uso de axios está comentado dentro da função. */}
    <button
      // onClick={handleSubmit} // ← Integração futura com a API
      className="mt-4 px-4 py-2 bg-[var(--primary)] text-[var(--text)] rounded hover:bg-[var(--primary)]/80 transition"
    >
      Publicar serviço
    </button>
  </div>,
];


 /* --------------------------------------------------------------------------
 * Renderização do modal de criação de serviço
 * -------------------------------------------------------------------------- */
return (
  // AnimatePresence é um componente do Framer Motion que permite animar
  // a entrada e saída condicional de elementos no DOM (como modais)
  <AnimatePresence>
    {isOpen && (
      // Camada de fundo escura semi-transparente
      <motion.div
        className="fixed inset-0 bg-black/60 flex justify-center  items-center z-50"
        // Animação de fade-in e fade-out do fundo
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Container principal do modal */}
        <motion.div
          className="bg-[var(--bg)] rounded-2xl shadow-2xl p-6 w-[95%] max-w-xl min-h-[32vh] max-h-[80vh] overflow-y-auto overflow-x-hidden relative"
          // Animação inicial (escala e opacidade) para entrada suave
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring' }} // tipo "spring" dá um movimento elástico
        >
          {/* ------------------------------------------------------------------
           * Botão de fechar o modal
           * ------------------------------------------------------------------ */}
          <button
            onClick={onClose} // Função passada via props para fechar o modal
            className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--danger)]"
          >
            <X size={24} /> {/* Ícone de fechar (usando Lucide React) */}
          </button>

          {/* ------------------------------------------------------------------
           * Barra de progresso das etapas
           * ------------------------------------------------------------------ */}
          <div className="mx-10 h-2 bg-[var(--border-muted)] rounded-full mb-6 overflow-hidden">
            {/* A largura da barra animada é calculada conforme a etapa atual */}
            <motion.div
              className="h-2 bg-[var(--primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }} // progressPercentage vem da lógica do estado
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* ------------------------------------------------------------------
           * Renderização da etapa atual (step)
           * ------------------------------------------------------------------ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step} // chave muda conforme o step muda → permite animar a transição entre etapas
              initial={{ opacity: 0, x: 50, scale: 0.98 }} // entra da direita
              animate={{ opacity: 1, x: 0, scale: 1 }} // fica centralizado
              exit={{ opacity: 0, x: -50, scale: 0.98 }} // sai para a esquerda
              transition={{ duration: 0.3 }}
            >
              {stepsContent[step]} {/* Renderiza o conteúdo correspondente à etapa atual */}
            </motion.div>
          </AnimatePresence>

          {/* ------------------------------------------------------------------
           * Navegação entre etapas (botões "Anterior" e "Próximo")
           * ------------------------------------------------------------------ */}
          <div className="flex justify-between mt-6 ">
            {/* Botão para voltar uma etapa */}
            <button
              onClick={handlePrev}
              disabled={step === 0} // desativa se já estiver na primeira etapa
              className="px-4 py-2 bg-[var(--border-muted)] text-[var(--text)] rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {/* Botão para avançar (ou finalizar se for o último passo) */}
            <button
              onClick={handleNext}
              // As validações abaixo impedem o avanço se campos obrigatórios não estiverem preenchidos
              disabled={
                (step === 1 && !formData.category) ||
                (step === 2 && !formData.subcategory) ||
                (step === 3 &&
                  (!formData.title || !formData.description)) ||
                (step === 4 && !formData.price) ||
                (step === 7 && !formData.acceptedTerms) ||
                step === 8 // última etapa — o botão muda de função
              }
              className="px-4 py-2 bg-[var(--primary)] text-[var(--text)] rounded hover:bg-[var(--primary)]/80 transition disabled:opacity-50"
            >
              {/* Muda o texto do botão conforme a etapa */}
              {step === 8 ? 'Finalizado' : 'Próximo'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};