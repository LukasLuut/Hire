import './index.css';

function WhatsAppChatbot() {
  const phoneNumber = '51989767332'; // Número sem parênteses e traço
  const message = 'Olá, gostaria de falar com o atendimento.'; // Mensagem opcional
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="whatsapp-chatbot">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="whatsapp-icon" />
        Falar com Atendimento
      </a>
    </div>
  );
}

export default WhatsAppChatbot;
