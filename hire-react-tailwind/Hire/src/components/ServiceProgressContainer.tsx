import { useEffect, useState } from "react";
import { ServiceProgress, type ServiceDetails, type Step, type UserBadgeData } from "./ServiceProgress";
import { providerApi } from "../api/ProviderAPI";
import { hireAPI } from "../api/HireAPI";
import { ServiceProgressSkeleton } from "../skeletons/ServiceProgressSkeleton/ServiceProgressSkeleton";

export const demoSteps: Step[] = [
  { id: "created", label: "Solicitação criada", date: "2025-04-20" },
  { id: "accepted", label: "Prestador aceitou", date: "2025-04-21" },
  { id: "started", label: "Serviço concluído", date: "2025-04-25" },

];

export const demoProvider: UserBadgeData = {
  id: "u1",
  name: "Lucas William",
  role: "Prestador",
  avatar: null,
};

export const demoClient: UserBadgeData = {
  id: "u2",
  name: "Cliente Exemplo",
  role: "Contratante",
  avatar: null,
};



export const demoDetails: ServiceDetails = {
  orderId: "123456",
  title: "Renovação do banheiro",
  price: 1000,
  deadline: "3 dias",
  rating: 4.9,
  paymentMethod: "Cartão de crédito",
};

export function ServiceProgressContainer() {
  const handleAction = (act: string) => alert(`Ação: ${act}`);
  const handleMessage = () => alert("Abrir chat");
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [treatedData, setTreatedData] = useState([]);

  useEffect(() => {
  
    const getData = async () => {
      const token = localStorage.getItem("token");

      if(!token) {
        return;
      }

      const provider = await providerApi.getByUser(token);
      if(!provider || !provider.id) return;
      
      const hires: Array<any> = await hireAPI.getHireByProviderId(provider.id);
      setData(hires);
      setLoading(false);
    }
    getData();

  }, []);

  if(data.length > 0) {
    data.forEach((e) => {
      const provider: UserBadgeData = {
        id: e.user.id,
        name: e.user.name,
        role: "Prestador",
        avatar: null,
      };
      alert(JSON.stringify(provider))
    });

  } else {
    return <div className="bg-[var(--bg-dark)] min-h-screen md:px-120 p-4 md:p-10">
      <div className="md:text-1xl flex justify-center italic w-full h-full p-6 mt-20 border-1 border-[var(--border)] md:p-10 bg-[var(--bg-light)] rounded-2xl text-[var(--text)] shadow-lg hover:shadow-[0_0_25px_-5px_var(--primary)/20]">
      Nenhum serviço para mostrar</div>
    </div> 
  }

  return (
    <div className="bg-[var(--bg-dark)] min-h-screen md:px-120 p-4 md:p-10">
      {loading ? (
        <ServiceProgressSkeleton/>
      ) : 
      <ServiceProgress
        steps={demoSteps}
        currentStep={"started"}
        provider={demoProvider}
        client={demoClient}

        details={demoDetails}
        viewFor={"provider"}
        onAction={handleAction}
        onMessage={handleMessage}
      />}

      {/* Versão para contratante também disponível para testes */}
      {/* <div className="">
        <ServiceProgress
          steps={demoSteps}
          currentStep={"started"}
          provider={demoProvider}
          client={demoClient}

          details={demoDetails}
          viewFor={"client"}
          onAction={handleAction}
          onMessage={handleMessage}
        />
      </div> */}
    </div>
  );
}