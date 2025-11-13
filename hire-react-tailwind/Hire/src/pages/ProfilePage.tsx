/* --------------------------------------------------------------------------
 * ProfilePage.tsx
 *
 * Página de perfil com:
 *  - Mock de dados locais (perfil e avaliações)
 *  - Estrutura de carregamento (simulação de fetch)
 *  - Edição básica de perfil (nome e bio)
 *  - Exibição de avaliações
 *  - Responsividade com estado `isMobile`
 *
 * Desenvolvido para ser fácil de entender e manter.
 * -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ServiceGalleryMagazine from "../components/ServiceGallery/ServiceGallery/ServiceGallery";
import { Star, Edit3, MessageSquare } from "lucide-react";
import { ServiceCreationWizardModal } from "../components/ServiceCreator/ServiceCreationWizardModal";
import ServiceNegotiationModal from "../components/Negotiation/ServiceNegotiationModal";
import ServiceResponseModal from "../components/Negotiation/ServiceResponseModal";
import ServiceFormalizerModal from "../components/Negotiation/ServiceFormalizerModal";
import ProviderRegistration from "../components/ProviderRegistration/ProviderRegistration";
import ProviderRegistrationContainer from "../components/ProviderRegistration/ProviderRegistration/Principal/ProviderRegistrationContainer";

/* --------------------------------------------------------------------------
 * MOCKS DE DADOS
 * Usados enquanto não há backend (ou caso a API falhe).
 * -------------------------------------------------------------------------- */
const mockReviews = [
  { id: 1, name: "João Silva", rating: 5, comment: "Excelente trabalho, muito profissional!" },
  { id: 2, name: "Maria Oliveira", rating: 4, comment: "Ótima comunicação e entrega dentro do prazo." },
  { id: 3, name: "Carlos Santos", rating: 5, comment: "Serviço impecável, recomendo sem dúvidas!" },
];

const mockProfile = {
  name: "Vitor Reis",
  bio: "Especialista em desenvolvimento de aplicativos e interfaces web modernas. Mais de 5 anos de experiência criando soluções digitais para clientes de diversos setores.",
  image: "https://api.dicebear.com/9.x/miniavs/svg?seed=vitorreis.svg",
  rating: 4.8,
  reviewsCount: 24,
};

/* --------------------------------------------------------------------------
 * COMPONENTE PRINCIPAL
 * -------------------------------------------------------------------------- */
export default function ProfilePage() {
  /* ------------------------------------------------------------------------
   * ESTADOS
   * ------------------------------------------------------------------------ */
 
  const [profile, setProfile] = useState<typeof mockProfile | null>(null);
  const [reviews, setReviews] = useState<typeof mockReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openContratar, setOpenContratar]=useState(false)
  const [isOpenResponse, setIsOpenResponse]=useState(false)
  const [isOpenChat, setIsOpenChat]=useState(false)


  /* ------------------------------------------------------------------------
   * SIMULAÇÃO DE CARREGAMENTO DE DADOS
   * - Tenta buscar dados de uma API (comentado por enquanto)
   * - Caso falhe, usa os dados mockados
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Exemplo de como seria uma chamada real (ainda desativada):
        // const [profileRes, reviewsRes] = await Promise.all([
        //   axios.get("/api/profile"),
        //   axios.get("/api/reviews"),
        // ]);

        // Caso não haja resposta, usamos os mocks:
        const profileData = mockProfile;
        const reviewsData = mockReviews;

        setProfile(profileData);
        setReviews(reviewsData);
      } catch (error) {
        console.warn("Erro ou timeout, usando mock...");
        setProfile(mockProfile);
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ------------------------------------------------------------------------
   * FUNÇÕES DE EDIÇÃO
   * ------------------------------------------------------------------------ */
  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleProfileChange = (field: keyof typeof mockProfile, value: string) => {
    if (profile) setProfile({ ...profile, [field]: value });
  };

  /* ------------------------------------------------------------------------
   * FUNÇÃO PARA ABERTURA DO MODAL DE CONTRATAÇÃO
   * ------------------------------------------------------------------------ */
  const handleContratar = () =>{
    setOpenContratar(true);
  }

  /* ------------------------------------------------------------------------
   * ESTADO DE CARREGAMENTO (Tela de loading)
   * ------------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--text)]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-1 rounded-full border-4 border-transparent border-t-blue-300 animate-spin-slow" />
        </div>
        <p className="mt-6 text-lg text-[var(--text-muted)] animate-pulse">
          Carregando perfil...
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------
   * RENDERIZAÇÃO PRINCIPAL
   * ------------------------------------------------------------------------ */
  return (
    <div className="min-h-screen pt-15 sm:pt-20 bg-[var(--bg-dark)] text-[var(--text)] transition-colors duration-300">

      {/* ===============================================================
       * SEÇÃO HERO / CABEÇALHO DO PERFIL
       * =============================================================== */}
      <section className="relative flex flex-col md:flex-row items-center justify-center gap-6 bg-[var(--bg-dark)] p-8">
        {/* IMAGEM DE PERFIL */}
        <div className="relative">
          <img
            src={profile?.image}
            alt="Foto de perfil"
            className="w-70 h-70 rounded-full border-4 border-[var(--primary)] object-cover"
          />

          {/* BOTÃO DE EDIÇÃO */}
          <button
            onClick={handleEditToggle}
            className="absolute bottom-1 right-0 bg-[var(--primary)] text-white rounded-full p-2"
            title="Editar perfil"
          >
            <Edit3 size={18}/>
          </button>
        </div>

        {/* INFORMAÇÕES PRINCIPAIS DO PERFIL */}
        <div>
          {/* NOME + AVALIAÇÃO */}
          <div className="flex items-center gap-4 flex-wrap">
            {isEditing ? (
              <input
                value={profile?.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                className="bg-[var(--bg-light)] border border-[var(--primary)] rounded-lg px-2 py-1 text-2xl"
              />
            ) : (
              <h1 className="text-4xl font-bold">{profile?.name}</h1>
            )}

            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={20} fill="currentColor" />
              <span className="font-semibold">
                {profile?.rating ? profile.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-[var(--text-muted)] text-sm">
                ({profile?.reviewsCount} avaliações)
              </span>
            </div>
          </div>

          <p className="pl-2 text-[var(--text-muted)]">
            Desenvolvedor Web & Designer UI/UX
          </p>
          {/* CAIXA DE EDIÇÃO */}
            {/* BIO / SOBRE */}
          <section className="p-5 pb-10 md:px-5">
            <h2 className="text-xl font-semibold mb-2">Sobre</h2>
            {isEditing ? (
              <textarea
                value={profile?.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                className="md:w-2xl w-xs bg-[var(--bg-light)] border border-[var(--primary)] rounded-lg p-2 text-[var(--text)] resize-none h-32"
              />
            ) : (
              <p className="text-[var(--text-muted)] max-w-2xl">{profile?.bio}</p>
            )}
          </section>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex gap-4 mt-2">
            <button 
            onClick={handleContratar}
            className="px-2 md:px-4  py-2 bg-[var(--primary)] text-white rounded-lg hover:brightness-110 transition">
              Contratar
            </button>
            <button 
            onClick={()=>{setIsOpenResponse(true)}}
            className="px-2 md:px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-light)] transition">
              Mensagem
            </button>
             {/* BOTÃO DO MODAL DE CRIAÇÃO DE SERVIÇO */}
            <button 
            onClick={()=>{setOpen(true)}}
            className="px-2 md:px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:brightness-110 transition">
               Serviço +
            </button>
             <button 
            onClick={()=>{setIsOpenChat(true)}}
            className="px-2 md:px-4 py-2 border flex gap-2 items-center border-[var(--border)] rounded-lg hover:bg-[var(--bg-light)] transition">
              <MessageSquare size={20} /> Chat
            </button>
          </div>
        </div>
      </section>
      {/* ===============================================================
       * SEÇÃO DO CHAT
       * =============================================================== */}      
      {/* <ServiceFormalizerModal service={undefined} isOpen={isOpenChat} onClose={() => setIsOpenChat(false)}/> */}

        {/* ===============================================================
       * SEÇÃO DO CHAT
       * =============================================================== */}
       {isOpenChat?( <ProviderRegistrationContainer />):(<p></p>)}
      

       {/* ===============================================================
       * SEÇÃO DE CRIAÇÃO DE SERVIÇOS
       * =============================================================== */}      
      <ServiceCreationWizardModal  isOpen={open} onClose={() => setOpen(false)}/>


       {/* ===============================================================
       * SEÇÃO DE RESPOSTA DE SERVIÇOS
       * =============================================================== */} 
      <ServiceResponseModal isOpen={isOpenResponse} onClose={()=>{setIsOpenResponse(false)}}/>

       {/* ===============================================================
       * SEÇÃO DE CRIAÇÃO DE ORÇAMENTO
       * =============================================================== */} 
      <ServiceNegotiationModal isOpen= {openContratar} onClose={()=>{setOpenContratar(false)}} />

      {/* ===============================================================
       * SEÇÃO DE GALERIA DE SERVIÇOS
       * =============================================================== */}
      <section className="py-8 md:px-20">
        <ServiceGalleryMagazine />
      </section>

      {/* ===============================================================
       * SEÇÃO DE AVALIAÇÕES
       * =============================================================== */}
      <section className="p-8 md:px-20">
        <h2 className="text-2xl font-bold mb-6">Avaliações</h2>

        {/* Caso ainda não haja avaliações */}
        {!reviews ? (
          <div className="text-[var(--text-muted)]">Carregando avaliações...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                className="bg-[var(--bg-light)]/20 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-[var(--border)] flex flex-col gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Avaliação (estrelas e comentário) */}
                <div className="text-yellow-400">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p className="text-[var(--text-muted)] flex-1">{review.comment}</p>

                <span className="text-[var(--text)]/80 font-semibold mt-2">
                  — {review.name}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
