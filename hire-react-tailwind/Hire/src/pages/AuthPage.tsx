import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import bgImage from "../assets/bg-login.png";
import hirePng from "../assets/Hire..png"
import { userAPI, type UserAPI, type UserLoginAPI } from "../api/UserAPI";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
  });
  const [formLoginData, setFormLoginData] = useState({ 
    email: "",
    password: "",
  });

  const cleanForm = () => {
    setFormData({
      name: "",
      cpf: "",
      email: "",
      password: "",
    });

    setFormLoginData({
      "email": "",
      "password": ""
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita reload da página

    try {
      // Chama a função que faz o registro
      if (isLogin) {
        await handleLogin(formLoginData)
        alert("")

      } else {

        await handleRegistrar(formData);
        alert("Usuário registrado com sucesso!");
        setIsLogin(true);
        cleanForm();

      }
    } catch (error: any) {
      console.error(isLogin ? "Usuário não encontrado: " : "Erro ao registrar usuário:", error);
      alert(error.message || "Erro na requisição!");
    }
  };

  const handleRegistrar = async (data: UserAPI) => {
    return await userAPI.create({
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      password: data.password
    })
  }

  const handleLogin = async (data: UserLoginAPI) => {
    return await userAPI.login({
      email: data.email,
      password: data.password
    })
  }

  const formatCPF = (value: string) => {
  // Remove tudo que não é número e adiciona máscara
    const onlyNums = value.replace(/\D/g, "");
    return onlyNums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

// Atualiza e formata o CPF no estado
  const handleChangeCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData((prev) => ({ ...prev, cpf: formatted }));
  };



  return (
    <div
      className="min-h-screen flex  items-center bg-[linear-gradient(135deg,_#000_0%,_#000_50%,_#000_75%,_var(--primary)_100%)] justify-around px-80"
    >
      <img src={hirePng} className="max-w-120" alt="logo hire" />
      <div
        className="relative w-full max-w-md md:h-[590px] rounded-3xl overflow-hidden shadow-[0_0_40px_10px_var(--primary)]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: "color-mix(in oklch, var(--bg-dark), transparent 90%)",

          }}
        />

        {/* botões slider */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 flex rounded-full p-1 backdrop-blur-md border shadow-lg z-20 w-[80%] max-w-[260px]"
          style={{
            backgroundColor: "color-mix(in oklch, var(--bg-light), transparent 30%)",
            borderColor: "var(--border-muted)",
          }}
        >
          <div className="relative flex w-full">
            {/* Bolha deslizante animada */}
            <motion.div
              layout
              animate={{ x: isLogin ? 0 : "100%" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
              }}
              className="absolute left-0 top-0 w-1/2 h-full rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className="relative z-10 w-1/2 py-2 text-sm font-medium transition-colors"
              style={{
                color: isLogin ? "var(--text)" : "var(--text-muted)",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="relative z-10 w-1/2 py-2 text-sm font-medium transition-colors"
              style={{
                color: !isLogin ? "var(--text)" : "var(--text-muted)",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* container de formulários */}
        <div className="absolute inset-0 mt-15 flex items-center justify-center p-6 md:p-8 z-10">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
                className="w-full rounded-2xl p-6 md:p-8 bg-[var(--bg-dark)]/50 backdrop-blur-sm shadow-lg border-b-1 border-[var(--border)]"

              >
                <h2
                  className="text-2xl text-[var(--text)] md:text-3xl font-semibold mb-6 text-center"

                >
                  Bem-vindo de volta
                </h2>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"

                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"

                  />
                  <button
                    type="submit"
                    className="w-full py-3 text-[var(--text)] rounded-lg border-b-1 border-[var(--primary)] transparent-50% bg-[var(--primary)] font-semibold transition text-sm md:text-base"
                  >
                    Entrar
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                }}
                className="w-full rounded-2xl border-b-1  border-[var(--border)] p-6 md:p-8 backdrop-blur-md shadow-lg"
                style={{
                  backgroundColor: "color-mix(in oklch, var(--bg-dark), transparent 50%)",

                }}
              >
                <h2
                  className="text-2xl md:text-3xl font-semibold mb-6 text-center text-[var(--text)]"

                >
                  Crie sua conta
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nome completo"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"
                    onChange={handleChange}
                    value={formData.name}
                  />
                  <input
                    type="text"
                    name="cpf"
                    required
                    placeholder="CPF"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"
                    onChange={handleChangeCPF}
                    value={formatCPF(formData.cpf)}
                    inputMode="numeric"
                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                    maxLength={14}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"
                    onChange={handleChange}
                    value={formData.email}
                  />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Senha"
                    className="w-full p-3 rounded-lg placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 text-sm md:text-base text-[var(--text)] border-b-1 border-[var(--border)]"
                    onChange={handleChange}
                    value={formData.password}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold transition text-sm md:text-base"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--text)",
                    }}
                  >
                    Registrar
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Efeitos orgânicos de luz */}

      </div>
    </div>
  );
}
