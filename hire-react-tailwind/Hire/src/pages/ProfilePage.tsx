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
import { motion } from "framer-motion";
import ServiceGalleryMagazine from "../components/ServiceGallery/ServiceGallery/ServiceGallery";
import { Star, Edit3, MessageSquare } from "lucide-react";
import ServiceNegotiationModal from "../components/Negotiation/ServiceNegotiationModal";
import ServiceResponseModal from "../components/Negotiation/ServiceResponseModal";
import ServiceFormalizerModal from "../components/Negotiation/ServiceFormalizerModal";
import ProviderRegistration from "../components/ProviderRegistration/ProviderRegistration";
import ProviderRegistrationContainer from "../components/ProviderRegistration/ProviderRegistration/Principal/ProviderRegistrationContainer";
import ServiceEditor from "../components/ServiceEditor/ServiceEditor";
import { useLocation, useNavigate } from "react-router-dom";
import { userAPI } from "../api/UserAPI";
import { type User } from "../interfaces/UserInterface"
import { providerApi } from "../api/ProviderAPI";
import type { ProviderForm } from "../components/ProviderRegistration/ProviderRegistration/helpers/types-and-helpers";
import ProviderHero from "../components/ProviderHero/ProviderHero";
import ServiceDashboardSophisticated from "./DashboardClient";

/* --------------------------------------------------------------------------
 * MOCKS DE DADOS
 * Usados enquanto não há backend (ou caso a API falhe).
 * -------------------------------------------------------------------------- */


const mockReviews = [
  { id: 1, name: "João Silva", rating: 5, comment: "Excelente trabalho, muito profissional!" },
  { id: 2, name: "Maria Oliveira", rating: 4, comment: "Ótima comunicação e entrega dentro do prazo." },
  { id: 3, name: "Carlos Santos", rating: 5, comment: "Serviço impecável, recomendo sem dúvidas!" },
];

export const mockProvider: ProviderForm = {
  name: "",
  cnpj: "",
  professionalEmail: "",
  professionalPhone: "",
  shortDescription:
    "",
  profilePhoto: null,

  companyName: "",
  category: "Tecnologia",
  subcategories: [],
  experienceLevel: "especialista",

  portfolio: [],
  portfolioPreviews: [
    "/portfolio/site-1.png",
    "/portfolio/app-2.png",
    "/portfolio/dashboard-3.png",
  ],

  availability: {
    monday: { start: "09:00", end: "18:00" },
    tuesday: { start: "09:00", end: "18:00" },
    wednesday: { start: "09:00", end: "18:00" },
    thursday: { start: "09:00", end: "18:00" },
    friday: { start: "09:00", end: "17:00" },
    saturday: null,
    sunday: null,
  },

  inPerson: true,
  online: true,
  onlineLink: "https://meet.google.com/lw-studio",

  hasPhysicalLocation: true,
  address: {
    cep: "01000-000",
    street: "Av. Paulista",
    number: "1000",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    lat: -23.561684,
    lng: -46.656139,
  },
  serviceRadiusKm: 25,

  idDocument: null,
  certifications: [],
  links: [
    "https://lwstudio.com.br",
    "https://github.com/lucaswilliam",
    "https://linkedin.com/in/lucaswilliam",
  ],

  acceptsCustomProposals: true,
  notifications: {
    email: true,
    whatsapp: true,
  },

  showApproxLocation: true,
  allowReviews: true,
  showPrices: true,
  status: "available",
};

const mockProfile = {
  name: "Vitor Reis",
  bio: "Especializado em desenvolvimento web, UI/UX e soluções digitais sob medida para pequenas e médias empresas",
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
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [openContratar, setOpenContratar]=useState(false)
  const [isOpenResponse, setIsOpenResponse]=useState(false)
  const [isOpenChat, setIsOpenChat]=useState(false)
  const [isClient, setIsClient]=useState(true)
  const [registration, setRegistration]=useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Todas as informações do usuário
  const [user, setUser] = useState<User>({
    id: 0,
    name: "",
    email: "",
    about: "",
  })
  const [provider, setProvider] = useState<boolean>(false);

  /* ------------------------------------------------------------------------
   * SIMULAÇÃO DE CARREGAMENTO DE DADOS
   * - Tenta buscar dados de uma API (comentado por enquanto)
   * - Caso falhe, usa os dados mockados
   * ------------------------------------------------------------------------ */

  useEffect(() => {
    const getUser = async () => {
      if(!token) {
      navigate('/auth')
      return;
    }

      const profileData = mockProfile;
      const reviewsData = mockReviews;

      setProfile(profileData);
      setReviews(reviewsData);

      const user: User | null = await userAPI.getUser(token);
      
      if(!user) {
        return;
      } else {
        setUser(user);
      };

      const provider = await providerApi.getByUser(token);

      if(!provider) {
        setProvider(false);
      } else {
        setProvider(true);
      }
    }

    getUser();  
  }, []); 

  
  useEffect(() => {
    if(provider) localStorage.setItem("provider", "1");
    if(!provider) localStorage.setItem("provider", "0")
  }, [provider])

   // Fecha com ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setIsEditing(false);
    }

    if (isEditing) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isEditing]);

  /* ------------------------------------------------------------------------
   * FUNÇÕES DE EDIÇÃO
   * ------------------------------------------------------------------------ */
  const handleEditToggle = () => {setIsEditing((prev) => !prev);
    handleUpdate();
  }

  /* ------------------------------------------------------------------------
   * FUNÇÃO PARA ABERTURA DO MODAL DE CONTRATAÇÃO
   * ------------------------------------------------------------------------ */
  const handleUpdate = async () => {
    if(!isEditing) return;

    const token = localStorage.getItem("token")
    if(!token) return;
    
    try {
      const res = await userAPI.update({name: user?.name, about: user?.about}, token);
      const updateEmail = await userAPI.updateUser(token, user.email);
      alert("Informações editadas com sucesso!")
      return { res, updateEmail };
    } catch (err: any) {
      console.error(err)
    }
  }

  const handleDelete = async () => {

    const token = localStorage.getItem("token")
    if(!token) return;
    
    try {
      const res = await userAPI.deleteUser(token)
      alert("Usuário deletado com sucesso!")
      localStorage.removeItem("token");
      navigate('/auth')
      return res;
    } catch (err: any) {
      console.error(err)
    }
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
   * RENDERIZAÇÃO PARA PRESTADOR (COM GALERIA DE SERVIÇOS)
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
                value={user.name}
                onChange={(e) => {setUser((prev: any) => ({...prev, name: e.target.value}))
              location.state.user.name = e.target.value
              }}
                className="bg-[var(--bg-light)] border border-[var(--primary)] rounded-lg px-2 py-1 text-2xl"
              />
            ) : (
              <h1 className="text-4xl font-bold">{user.name}</h1>
            )}
            {isEditing && (
              <button className="px-2 py-2 text-md bg-red-700 rounded-md" onClick={handleDelete}>Excluir Usuário</button>
            )}

            {/* <div className="flex items-center gap-1 text-yellow-400">
              <Star size={20} fill="currentColor" />
              <span className="font-semibold">
                {profile?.rating ? profile.rating.toFixed(1) : "0.0"}
              </span>
              <span className="text-[var(--text-muted)] text-sm">
                ({profile?.reviewsCount} avaliações)
              </span>
            </div> */}
          </div>

          {/* <p className="pl-2 text-[var(--text-muted)]">
            Desenvolvedor Web & Designer UI/UX
          </p> */}
          {/* CAIXA DE EDIÇÃO */}
            {/* BIO / SOBRE */}
          <section className="p-5 pb-10 flex flex-col md:px-5">
            <h2 className="text-xl font-semibold mb-2">Sobre</h2>
            {isEditing ? (
              <textarea
                value={user.about}
                placeholder="Fale um pouco sobre você..."
                onChange={(e) => setUser((prev: any) => ({...prev, about: e.target.value}))}
                className="md:w-2xl w-xs bg-[var(--bg-light)] border border-[var(--primary)] rounded-lg p-2 text-[var(--text)] resize-none h-32"
              />
            ) : (
              <p className="text-[var(--text-muted)] max-w-2xl">{!user.about ? "Fale um pouco sobre você... Por exemplo: ''Sou uma pessoa dedicada, sempre em busca de aprendizado e novas experiências. Gosto de colaborar, compartilhar conhecimento e enfrentar desafios que contribuam para meu crescimento pessoal e profissional.''" : user.about}</p>
            )} 
            {isEditing && (
              <input
              className=" bg-[var(--bg-light)] mt-5 border border-[var(--primary)] rounded-lg p-2 text-[var(--text)] resize-none h-8"
              value={user.email}
              onChange={(e) => setUser((prev: any) => ({...prev, email: e.target.value}))}
              placeholder="Email"
              />
            )}
          </section>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-end gap-4 mt-2">
             {(!registration && !provider) && (
              <button className="bg-[var(--primary)] rounded-xl w-55 h-15 mt-6 text-lg text-white animate-bounce "
                onClick={()=>setRegistration(true) }>
                Cadastre sua empresa
              </button>              
            )}
            {/* <button 
            onClick={handleContratar}
            className="px-2 md:px-4  py-2 bg-[var(--primary)] text-white rounded-lg hover:brightness-110 transition">
              Contratar
            </button> */}
            {/* <button 
            onClick={()=>{setIsOpenResponse(true)}}
            className="px-2 md:px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-light)] transition">
              Mensagem
            </button> */}
             {/* BOTÃO DO MODAL DE CRIAÇÃO DE SERVIÇO */}
            {/* <button 
            onClick={()=>{setOpen(true)}}
            className="px-2 md:px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:brightness-110 transition">
               Serviço +
            </button> */}
             <button 
                onClick={()=>{setIsOpenChat(true)}}
                className="px-2 md:px-4 py-2 border min-h-14 bottom-0 flex gap-2 items-center border-[var(--border)] rounded-lg hover:bg-[var(--bg-light)] transition">
              <MessageSquare size={20} /> Chat
            </button>
          </div>
        </div>
      </section>
      {/* ===============================================================
       * SEÇÃO DO CHAT
       * =============================================================== */}      
      <ServiceFormalizerModal service={undefined} isOpen={isOpenChat} onClose={() => setIsOpenChat(false)}/>

       {/* ===============================================================
       * SEÇÃO DE CRIAÇÃO DE SERVIÇOS
       * =============================================================== */}      
        <ServiceEditor serviceId={null} isOpen={open} onClose={() => setOpen(false)}  />

       {/* ===============================================================
       * SEÇÃO DE RESPOSTA DE SERVIÇOS
       * =============================================================== */} 
      <ServiceResponseModal isOpen={isOpenResponse} onClose={()=>{setIsOpenResponse(false)}}/>

       {/* ===============================================================
       * SEÇÃO DE CRIAÇÃO DE ORÇAMENTO
       * =============================================================== */} 
      <ServiceNegotiationModal isOpen= {openContratar} onClose={()=>{setOpenContratar(false)}} />

        {/* ===============================================================
       * SEÇÃO DE REGISTRO E GALERIA DE SERVIÇOS
       * =============================================================== */}
         {registration&&(<ProviderRegistrationContainer isOpen={registration} onClose={() => setRegistration(false)} />)}

        {isClient ?(
          <div className="flex flex-col items-center justify-center min-h-50 bg-[var(--bg-dark)] border-b-1  border-[var(--border)] text-[var(--text)]">
           
            {!registration&&(<ServiceDashboardSophisticated />)}
            
          </div>
        ):(
          <section className="py-8 md:px-20">
            <ServiceGalleryMagazine />
          </section>
        )}
      

      {/* ===============================================================
       * SEÇÃO DE AVALIAÇÕES
       * =============================================================== */}
      {!isClient&&(
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
      )}
      
    </div>
  );
}
