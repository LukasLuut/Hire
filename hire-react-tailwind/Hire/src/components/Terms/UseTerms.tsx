import React from "react";

interface UseTermsProps {
  setIsPrivacyOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function UseTerms({ setIsPrivacyOpen }: UseTermsProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
  <div
    className="bg-black text-[var(--text)] rounded-2xl border-4 border-[#007bff] shadow-2xl 
               w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative"
  >
    <h2 className="text-lg font-semibold mb-4 text-[#007bff]">
      Política de Privacidade e Termos de Uso
    </h2>

    <p className="text-sm leading-relaxed text-gray-300 space-y-2">
      <strong>1. Finalidade da plataforma:</strong> Este sistema tem como objetivo intermediar a contratação de serviços entre clientes e prestadores de forma segura e eficiente.
      <br />
      <strong>2. Coleta de dados:</strong> Coletamos apenas as informações necessárias para cadastro, autenticação e funcionamento da plataforma, como nome, e-mail e senha. Dados sensíveis, como CPF, são armazenados com segurança e nunca exibidos publicamente.
      <br />
      <strong>3. Exibição de informações:</strong> Perfis de usuários mostram apenas informações básicas e relevantes para a interação entre cliente e prestador, sem expor dados pessoais ou sensíveis.
      <br />
      <strong>4. Uso das informações:</strong> As informações fornecidas são utilizadas exclusivamente para fins de funcionamento do sistema, como comunicação entre as partes e gestão das contratações.
      <br />
      <strong>5. Armazenamento e segurança:</strong> Todos os dados são armazenados de forma segura, conforme a LGPD (Lei nº 13.709/2018), e protegidos contra acessos não autorizados.
      <br />
      <strong>6. Direitos do usuário:</strong> Você pode solicitar a atualização, correção ou exclusão de seus dados a qualquer momento, conforme seus direitos garantidos pela legislação vigente.
      <br />
      <strong>7. Responsabilidades:</strong> O uso indevido da plataforma ou o compartilhamento de informações falsas pode resultar na suspensão ou exclusão da conta.
      <br />
      <strong>8. Contato:</strong> Em caso de dúvidas ou solicitações relacionadas à privacidade, entre em contato conosco pelo e-mail <span className="text-[#007bff]">suporte@hire.com</span>.
    </p>

    <div className="flex justify-end mt-6">
      <button
        type="button"
        onClick={() => setIsPrivacyOpen(false)}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-[#007bff] text-white hover:opacity-90"
      >
        Fechar
      </button>
    </div>
  </div>
</div>

  );
}
