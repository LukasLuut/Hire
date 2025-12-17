import {  useEffect, useState } from "react";
import type {ReactNode} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { Save, Trash2, PlusCircle, Trash } from "lucide-react";
import { serviceAPI, type ServiceData } from "../../api/ServiceAPI";
import type { Service } from "../../interfaces/ServiceInterface";
import { categoryAPI } from "../../api/CategoryAPI";
import type { Category } from "../../interfaces/CategoryInterface";
import { providerApi } from "../../api/ProviderAPI";


/* --------------------------------------------------------------------------
 * Interface de dados do serviço
 * -------------------------------------------------------------------------- */
// interface Service {
//   id: number;
//   title: string;
//   description: string;
//   category?: string;
//   subcategory?: string;
//   price?: string;
//   negotiable?: boolean;
//   duration?: string;
//   requiresScheduling?: boolean;
//   cancellationNotice?: string;
//   acceptedTerms?: boolean;
//   images: string[];
// }
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number | null;
}

/* --------------------------------------------------------------------------
 * Componente principal do painel de serviços
 * -------------------------------------------------------------------------- */
export default function ServiceDashboard({ isOpen, onClose, serviceId }: ModalProps) {
  /* --------------------------- Estado inicial dos serviços --------------------------- */
  /* --------------------------- Estado inicial dos serviços --------------------------- */
  
  const [providerId, setProviderId] = useState(0);

  useEffect(() => {
    const getProvider = async () => {
      const token = localStorage.getItem("token");
      if(!token) return;

      const provider: any = await providerApi.getByUser(token);

      if(!provider) return;

      setProviderId(provider.id);

    }

    getProvider();
  }, [])

  // Fecha com ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const [service, setService] = useState<Service>(
    {
      id: 0,
      title: "",
      description_service: "",
      price: "",
      duration: "",
      categoryId: null,
      subcategory: "",
      negotiable: false,
      requiresScheduling: false,
      acceptedTerms: true,
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
      cancellationNotice: ""
    },
  );

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryName, setCategoryName] = useState("");



  /* --------------------------- Controle de selessssssssssssssção e responsividade --------------------------- */
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Controle de qual slide está visível no mobile (editor ou preview)
  const [mobileSlide, setMobileSlide] = useState<"editor" | "preview">(
    "editor"
  );

  // Direção do slide (para controlar animação de entrada/saída)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  /* --------------------------- Atualiza estado ao redimensionar a tela --------------------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* --------------------------- Serviço atualmente selecionado --------------------------- */
  const selectedService: Service = service;

  /* --------------------------- Função para atualizar campos do serviço --------------------------- */
  const handleChange = (
  field: keyof Service,
  value: string | boolean | undefined | string[] | number
) => {
  setService((prev: any) => ({
    ...prev,
    [field]: value
  }));
};


  /* --------------------------- Funções do editor de imagens --------------------------- */

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  /* --------------------------- Função de swipe lateral (mobile) --------------------------- */
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (mobileSlide === "editor") {
      // Editor: arrastar para esquerda → preview
      if (info.offset.x < -50) {
        setSlideDirection("right"); // preview entra pela direita
        setMobileSlide("preview");
      }
    } else if (mobileSlide === "preview") {
      // Preview: arrastar para direita → volta para editor
      if (info.offset.x > 50) {
        setSlideDirection("left"); // editor entra pela esquerda
        setMobileSlide("editor");
      }
    }
  };

  /* --------------------------- Variants do framer-motion para animação --------------------------- */
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  /* --------------------------- Estilo modal mobile --------------------------- */
  const mobileModalClass =
    "absolute top-10 left-4 right-4 bottom-10 bg-[var(--bg-light)] rounded-2xl shadow-lg border border-[var(--border)] p-6 flex flex-col overflow-auto";


  useEffect(() => {
    const getCategory = async () => {
        const response: Category[] | null = await categoryAPI.getCategory();

        if(!response || response == undefined) return;

        const categoriesClone: Category[] = response.map((e) => {
          return {
           id: e.id,
           name: e.name,
           description: e.description };
        })
        setCategories(categoriesClone);
    }

    getCategory();
  }, []);

  useEffect(() => {
  }, [categories]);


  const [priceDigits, setPriceDigits] = useState(""); 


  const formatPrice = (digits: string) => {
    if (!digits) return "";
    return `R$ ${digits}`;
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");

    setPriceDigits(digits);
    handleChange("price", digits); // salva "123" no service
  };

  useEffect(() => {
    const getCategoryName = async () => {
      const category = await categoryAPI.getCategoryById(Number(selectedService.categoryId))

      if(!category) return;

      setCategoryName(category.name || "Marcenaria");
    }

    getCategoryName();
  }, [selectedService.categoryId])

  const [hasService, setHasService] = useState<boolean>(false);

  useEffect(() => {
    if(!serviceId || Number(serviceId) == 0) {
      setHasService(false);
      return;
    }

    if(serviceId > 0) {
      setHasService(true);
    }

    const setServiceToEdit = async () => {

      const serviceData: ServiceData | null = await serviceAPI.getServiceById(serviceId);
      if(!serviceData || typeof serviceData == "undefined") return;

      setService(
        {
        id: serviceData.id,
        title: serviceData.title,
        description_service: serviceData.description_service,
        price: String(serviceData.price),
        duration: serviceData.duration,
        categoryId: 10,
        subcategory: serviceData.subcategory,
        negotiable: false,
        requiresScheduling: false,
        acceptedTerms: true,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        cancellationNotice: ""
        }
      );

      setPriceDigits(String(serviceData.price))

      console.log('ESSE É O SERVIÇO: ' + JSON.stringify(serviceData))
    };

    setServiceToEdit();
  }, []);

  const handleDelete = async () => {
    try {
      await serviceAPI.deleteUser(selectedService.id);
      alert("Serviço removido com sucesso!")
      window.location.reload(); 
    }
    catch (err: any) {
      console.error(err)
    }
  }

  const handleUpdate = async () => {
    try {
      console.log("HANDLEEEEEE UPDATEDO")
      const formData = new FormData();

      formData.append("title", selectedService.title);
      formData.append("description_service", selectedService.description_service);
      formData.append("categoryId", String(selectedService.categoryId));
      formData.append("providerId", String(providerId));
      formData.append("price", selectedService.price);
      formData.append("duration", selectedService.duration);
      // formData.append("subcategory", selectedService.subcategory);
      formData.append("negotiable", String(selectedService.negotiable));
      formData.append("requiresScheduling", String(selectedService.requiresScheduling));
      // formData.append("image", imageFile);
      await serviceAPI.update(selectedService.id, formData);

      alert("Informações editadas com sucesso");
      window.location.reload();

    } catch (err: any) {
      console.error(err);
    }
  }

  /* --------------------------------------------------------------------------
   * Renderização principal
   * -------------------------------------------------------------------------- */
  return (
    <div  className="min-h-screen md:pt-15 pt-17 overflow-hidden bg-[var(--bg-dark)]/50 text-[var(--text)] flex flex-col md:flex-row transition-all duration-500 items-center justify-center">
      <div className="flex-1 relative flex overflow-hidden w-full max-w-[1024px]">

        {/* ----------------------------------------------------------------------
         * Editor do serviço
         * ----------------------------------------------------------------------
         * Modal no mobile, animação tipo slide usando framer-motion
         * ---------------------------------------------------------------------- */}
        <AnimatePresence initial={false} mode="wait">
          {(mobileSlide === "editor" || !isMobile) && (
            <motion.div
              key="editor"
              className={`${isMobile ? mobileModalClass : "w-1/2 p-6"}  md:ml-10 bg-[var(--bg-light)]  rounded-2xl shadow-lg border border-[var(--border)]`}
              custom={slideDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
            >
              {/* --------------------------- Título e descrição --------------------------- */}
              <h3 className="text-4xl text-[var(--primary)] font-bold mb-3">{hasService ? "Editar Serviço" : "Criar Serviço"}</h3>
              <h3 className="text-sm text-[var(--text-muted)] ml-1 mb-6">Monte sua vitrine digital e transforme seu trabalho em oportunidades reais.</h3>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col">
                  <span className="text-[var(--text-muted)] text-sm mb-1">
                    Título do Serviço
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: Consultoria Jurídica, Design Gráfico..."
                    value={selectedService.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-[var(--text-muted)] text-sm mb-1">
                    Descrição detalhada
                  </span>
                  <textarea
                    required
                    placeholder="Descreva o serviço, incluindo detalhes importantes..."
                    value={selectedService.description_service}
                    onChange={(e) =>
                      handleChange("description_service", e.target.value)
                    }
                    rows={4}
                    className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] resize-none"
                  />
                </label>

                {/* --------------------------- Categoria / Subcategoria --------------------------- */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Categoria</span>
                    <select
                      required
                      value={selectedService.categoryId ? selectedService.categoryId : ""}
                      onChange={(e) => handleChange("categoryId", Number(e.target.value))}
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    >
                      <option value="" disabled selected>Selecione uma categoria</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}

                    </select>
                    {/* <input
                      placeholder="Ex: Tecnologia, Beleza..."
                      type="text"
                      value={selectedService.categoryId}
                      onChange={(e) =>
                        handleChange("categoryId", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    /> */}
                  </label>
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Subcategoria</span>
                    <input
                      placeholder="Ex: Desenvolvimento Web, Cabelereiro..."
                      type="text"
                      value={selectedService.subcategory}
                      onChange={(e) =>
                        handleChange("subcategory", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                </div>

                {/* --------------------------- Preço / Duração --------------------------- */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Preço (R$)</span>
                    <input
                      placeholder="Ex: R$ 200,00"
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      value={formatPrice(priceDigits)}
                      onChange={onPriceChange}
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-[var(--text-muted)] text-sm mb-1">Duração média</span>
                    <input
                      placeholder="Ex: 2 horas, 1 dia..."
                      type="text"
                      value={selectedService.duration}
                      onChange={(e) =>
                        handleChange("duration", e.target.value)
                      }
                      className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                    />
                  </label>
                </div>

                {/* --------------------------- Switches --------------------------- */}
                <div className="flex flex-col gap-3 mt-2">
                  {/* Preço negociável */}
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text)]">Preço negociável</span>
                    <input
                      type="checkbox"
                      checked={selectedService.negotiable}
                      onChange={(e) =>
                        handleChange("negotiable", e.target.checked)
                      }
                      className="relative w-10 h-5 appearance-none bg-[var(--border)] rounded-full cursor-pointer transition-all duration-300
                         checked:bg-[var(--primary)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4
                         after:bg-[var(--bg-light)] after:rounded-full after:transition-all checked:after:translate-x-5"
                    />
                  </label>

                  {/* Requer agendamento */}
                  <label className="flex items-center justify-between">
                    <span className="text-[var(--text)]">Exige agendamento prévio</span>
                    <input
                      type="checkbox"
                      checked={selectedService.requiresScheduling}
                      onChange={(e) =>
                        handleChange("requiresScheduling", e.target.checked)
                      }
                      className="relative w-10 h-5 appearance-none bg-[var(--border)] rounded-full cursor-pointer transition-all duration-300
                         checked:bg-[var(--primary)] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4
                         after:bg-[var(--bg-light)] after:rounded-full after:transition-all checked:after:translate-x-5"
                    />
                  </label>

                  {/* Política de cancelamento */}
                  {selectedService.requiresScheduling && (
                    <label className="flex flex-col mt-2">
                      <span className="text-[var(--text-muted)] text-sm mb-1">
                        Política de cancelamento
                      </span>
                      <textarea
                        placeholder="Ex: Cancelamentos devem ser feitos com 24h de antecedência..."
                        value={selectedService.cancellationNotice}
                        onChange={(e) =>
                          handleChange("cancellationNotice", e.target.value)
                        }
                        rows={3}
                        className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[var(--text)] resize-none"
                      />
                    </label>
                  )}
                </div>

                {/* --------------------------- Editor de imagens --------------------------- */}
                {/* <div className="mt-4">
                  <h4 className="font-semibold mb-2">Imagens do serviço</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedService.imageUrl && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)]">
                      <img
                        src={selectedService.imageUrl}
                        alt="Imagem do serviço"
                        className="w-full h-full object-cover"
                      />

                      <button
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-[var(--bg-dark)]/70 p-1 rounded-full text-white hover:bg-red-600 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                    <button
                      onClick={addImage}
                      className="flex items-center justify-center w-24 h-24 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/20 transition"
                    >
                      <PlusCircle size={24} />
                    </button>
                  </div>
                </div> */}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Imagem do serviço</h4>

                  <div className="flex gap-2 flex-wrap">
                    {imagePreview ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[var(--border)]">
                        <img
                          src={imagePreview}
                          alt="Imagem do serviço"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-[var(--bg-dark)]/70 p-1 rounded-full text-white hover:bg-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <label
                          htmlFor="imageUpload"
                          className="flex items-center justify-center w-24 h-24 rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer hover:bg-[var(--bg-dark)]/20 transition"
                        >
                          <PlusCircle size={24} />
                        </label>

                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </>
                    )}
                  </div>
                </div>


                {/* --------------------------- Botão salvar --------------------------- */}
                <div className="mt-5 flex gap-3 justify-center">
                  <button
                    className="flex items-center justify-center gap-2 bg-[var(--primary)] text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
                    onClick={() => {
                      if(hasService) {
                        handleUpdate();
                        return;
                      }

                      if (
                        !selectedService.categoryId ||
                        !selectedService.description_service ||
                        !selectedService.title ||
                        !selectedService.price ||
                        !selectedService.subcategory
                      ) {
                        alert("Preencha todos os campos obrigatórios.");
                        return;
                      }

                      if (!imageFile) return alert("Selecione uma imagem");

                      const formData = new FormData();

                      // console.log("ESSE É O FORMATO ")

                      formData.append("title", selectedService.title);
                      formData.append("description_service", selectedService.description_service);
                      formData.append("categoryId", String(selectedService.categoryId));
                      formData.append("providerId", String(providerId));
                      formData.append("price", selectedService.price);
                      formData.append("duration", selectedService.duration);
                      formData.append("subcategory", selectedService.subcategory);
                      formData.append("negotiable", String(selectedService.negotiable));
                      formData.append("requiresScheduling", String(selectedService.requiresScheduling));
                      formData.append("image", imageFile);

                      try {
                        serviceAPI.create(formData);
                        alert("Serviço criado com sucesso;");
                        window.location.reload();
                        onClose();
                      } catch (err: any) {
                        console.error(err)
                      }
                    }}
                  >
                    <Save size={18} />{hasService ? "Salvar Alterações" : "Criar Serviço"}
                  </button>
                  {serviceId && (
                  <button className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition"
                  onClick={handleDelete}>
                    <Trash size={18} /> Excluir serviço
                  </button>

                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------------------------------------------------
         * Preview do serviço
         * ----------------------------------------------------------------------*/}
      <AnimatePresence initial={false} mode="wait">
  {(mobileSlide === "preview" || !isMobile) && (
    <motion.div
      key="preview"
      className={`${isMobile ? mobileModalClass : "w-1/2 p-6"} md:ml-10 max-h-[90vh] bg-[var(--bg-light)] rounded-2xl shadow-lg border border-[var(--border)] `}
      custom={slideDirection}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag={isMobile ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      {/* --------------------------- Imagem principal --------------------------- */}
    {imagePreview && (
      <img
        src={imagePreview ? imagePreview : selectedService.imageUrl}
        alt={selectedService.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
    )}

      {/* --------------------------- Informações do serviço --------------------------- */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          {selectedService.title}
        </h2>

        <p className="text-[var(--text-muted)] line-clamp-3">
          {selectedService.description_service}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <span className="font-semibold text-[var(--text)]">Categoria:</span>{" "}
            {categoryName || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Subcategoria:</span>{" "}
            {selectedService.subcategory || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Preço:</span>{" "}
            {selectedService.price || "-"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Duração:</span>{" "}
            {selectedService.duration || "-"}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-2">
          <div>
            <span className="font-semibold text-[var(--text)]">Negociável:</span>{" "}
            {selectedService.negotiable ? "Sim" : "Não"}
          </div>
          <div>
            <span className="font-semibold text-[var(--text)]">Exige agendamento:</span>{" "}
            {selectedService.requiresScheduling ? "Sim" : "Não"}
          </div>
          {selectedService.requiresScheduling && (
            <div>
              <span className="font-semibold text-[var(--text)]">Política de cancelamento:</span>{" "}
              {selectedService.cancellationNotice || "-"}
            </div>
          )}
        </div>

        {/* --------------------------- Lista de imagens adicionais --------------------------- */}
        {imagePreview && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <img
              src={imagePreview}
              alt="Preview da imagem"
              className="w-24 h-24 object-cover rounded-lg border border-[var(--border)]"
            />
          </div>
        )}

      </div>
    </motion.div>
  )}
</AnimatePresence>

         {/* --------------------------- Indicadores de slide (mobile) --------------------------- */}
        {isMobile && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            <span
              className={`w-3 h-3 rounded-full transition-colors ${
                mobileSlide === "editor"
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--border)]"
              }`}
            />
            <span
              className={`w-3 h-3 rounded-full transition-colors ${
                mobileSlide === "preview"
                  ? "bg-[var(--primary)]"
                  : "bg-[var(--border)]"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
