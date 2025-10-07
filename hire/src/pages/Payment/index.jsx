// import { useState } from 'react';
// import QRCode from 'react-qr-code';
// import Pix from 'pix-qrcode';
// import WhatsAppChatbot from '../../components/WhatsAppChatbot';
// import './index.css';

// function Payment() {
//   const [formData, setFormData] = useState({
//     nome: '',
//     numero: '',
//     expiracao: '',
//     cvv: '',
//     valor: ''
//   });
//   const [paymentMethod, setPaymentMethod] = useState('cartao');

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert('Pagamento processado com sucesso!');
//   };

//   // Gerar Pix Copia e Cola (payload) com chave estática de exemplo
//   let pixPayload = '';
//   if (paymentMethod === 'pix' && formData.valor) {
//     pixPayload = Pix({
//       key: '12345678901', // chave pix de exemplo
//       name: 'Hire Serviços',
//       city: 'BRASILIA',
//       value: parseFloat(formData.valor),
//       description: 'Pagamento de serviço',
//       image: 'qrcode.png',
//     }).payload();
//   }

//   return (
//     <div className="payment-container">
//       <h1>Pagamento</h1>
//       <div className="form-group">
//         <label htmlFor="valor">Valor (R$):</label>
//         <input
//           type="number"
//           id="valor"
//           name="valor"
//           value={formData.valor}
//           onChange={handleChange}
//           step="0.01"
//           required
//         />
//       </div>
//       <div className="payment-methods">
//         <label>
//           <input
//             type="radio"
//             name="paymentMethod"
//             value="cartao"
//             checked={paymentMethod === 'cartao'}
//             onChange={e => setPaymentMethod(e.target.value)}
//           />
//           Cartão de Crédito
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="paymentMethod"
//             value="pix"
//             checked={paymentMethod === 'pix'}
//             onChange={e => setPaymentMethod(e.target.value)}
//           />
//           Pix
//         </label>
//       </div>
//       {paymentMethod === 'cartao' && (
//         <form onSubmit={handleSubmit} className="payment-form">
//           <div className="form-group">
//             <label htmlFor="nome">Nome no Cartão</label>
//             <input
//               type="text"
//               id="nome"
//               name="nome"
//               value={formData.nome}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="numero">Número do Cartão</label>
//             <input
//               type="text"
//               id="numero"
//               name="numero"
//               value={formData.numero}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="expiracao">Data de Expiração</label>
//               <input
//                 type="text"
//                 id="expiracao"
//                 name="expiracao"
//                 value={formData.expiracao}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="cvv">CVV</label>
//               <input
//                 type="text"
//                 id="cvv"
//                 name="cvv"
//                 value={formData.cvv}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>
//           <button type="submit" className="payment-button">
//             Pagar
//           </button>
//         </form>
//       )}
//       {paymentMethod === 'pix' && formData.valor && (
//         <div className="pix-payment">
//           <p>Escaneie o QR Code para pagar via Pix</p>
//           <QRCode value={pixPayload} size={256} />
//           <div className="copy-paste">
//             <p>Pix Copia e Cola:</p>
//             <textarea readOnly value={pixPayload} style={{width: '100%'}} />
//           </div>
//         </div>
//       )}
//       <WhatsAppChatbot />
//     </div>
//   );
// }

// export default Payment;


import { useState } from 'react';
import QRCode from 'react-qr-code';
import Pix from 'pix-qrcode';
import WhatsAppChatbot from '../../components/WhatsAppChatbot';
import './index.css';
import imgPix from '../Payment/qrcode_localhost.png';


function Payment() {
  const [formData, setFormData] = useState({
    nome: '',
    numero: '',
    expiracao: '',
    cvv: '',
    valor: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('pix');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Pagamento processado com sucesso!');
  };

  // Gera o payload para Pix Copia e Cola usando pix-qrcode
  const pixPayload = paymentMethod === 'pix' && formData.valor
    ? Pix({
        key: 'chave-pix-exemplo@provedor.com', // Substitua pela chave Pix real
        name: 'Nome do Recebedor',
        city: 'CIDADE',
        image: {imgPix},
        description: 'Pagamento de serviço',
        value: parseFloat(formData.valor)
      }).payload()
    : '';

  return (
    <div className="payment-container">
      <h1>Pagamento</h1>
      <div className="form-group">
        <label htmlFor="valor">Valor (R$):</label>
        <input
          type="number"
          id="valor"
          name="valor"
          value={formData.valor}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div className="payment-methods">
        <label >
          <input
            type="radio"
            name="paymentMethod"
            value="cartao"
            checked={paymentMethod === 'cartao'}
            onChange={(e) => {setPaymentMethod(e.target.value)}}
          />
          Cartão de Crédito
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="pix"
            checked={paymentMethod === 'pix'}
            onChange={(e) => {setPaymentMethod(e.target.value)}}
          />
          Pix
        </label>
        
      </div>
      {paymentMethod === 'cartao' && (
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="nome">Nome no Cartão</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="numero">Número do Cartão</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiracao">Data de Expiração</label>
              <input
                type="text"
                id="expiracao"
                name="expiracao"
                value={formData.expiracao}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="payment-button">
            Pagar
          </button>
        </form>
      )}
      {paymentMethod === 'pix' && (
        <div className="pix-payment">
          <p>Escaneie o QR Code para pagar via Pix</p>
           <img src={imgPix} alt="QR Code Pix" style={{ width: "256px", height: "256px" }} />         
          <div className="copy-paste">            
            <p>Pix Copia e Cola:</p>
            <textarea readOnly value={pixPayload} style={{width: '100%'}} />
          </div>
        </div>
      )}
      <WhatsAppChatbot />
    </div>
  );
}

export default Payment;
