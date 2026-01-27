import { ServiceProgress, type ServiceDetails, type Step, type UserBadgeData } from "./ServiceProgress";

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

  return (
    <div className="bg-[var(--bg-dark)] md:px-120 p-4 md:p-10">
      <ServiceProgress
        steps={demoSteps}
        currentStep={"started"}
        provider={demoProvider}
        client={demoClient}

        details={demoDetails}
        viewFor={"provider"}
        onAction={handleAction}
        onMessage={handleMessage}
      />

      {/* Versão para contratante também disponível para testes */}
      <div className="mt-8">
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
      </div>
    </div>
  );
}