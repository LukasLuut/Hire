import type { ProviderForm } from "../components/ProviderRegistration/ProviderRegistration/helpers/types-and-helpers";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const validateFormData = (data: ProviderForm, step: number): boolean => {
  console.log("ESSE É O CNPJ: ", data.cnpj);

  if (step == 0) {
    if (!data.name || data.name.trim() == "") {
      alert("Insira um nome");
      return false;
    }
    if (data.cnpj) {
      if (data.cnpj.length !== 14) {
        alert("Insira um CNPJ válido");
        return false;
      }
    }
    if (!data.professionalEmail) {
      alert("Insira um e-mail");
      return false;
    }
    if (!isValidEmail(data.professionalEmail)) {
      alert("Insira um e-mail válido");
      return false;
    }
    if(!data.professionalPhone || data.professionalPhone.length !== 11) {
        alert("Insira um número de telefone válido");
        return false;
    }
  }

  return true;
};
