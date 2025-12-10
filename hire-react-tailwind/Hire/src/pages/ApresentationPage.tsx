// src/pages/LandingPageFull.tsx
// V4 — Landing Page FULL: Cinematic Showcase + Detailed Presentation
// - Designed for Hire. (commercial, cinematic, parallax scroll-telling)
// - TailwindCSS + Framer Motion + react-tsparticles
// - Modular single-file component for quick paste; split into smaller files if desired
// - Placeholders for illustrations in /assets/ (many cards ready to receive images)
// - AuthPage is embedded at the end as CTA

import React from "react";
import { LazyMotion, domAnimation, motion, useScroll, useTransform } from "framer-motion";
import Particles from "react-tsparticles";
import { FiChevronDown } from "react-icons/fi";
import AuthPage from "./AuthPage";

// -------------------------
// IMPORTANT: Dependencies
// -------------------------
// npm install framer-motion react-icons react-tsparticles tsparticles
// TailwindCSS setup assumed

export default function LandingPageFull() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full bg-[var(--bg,#05060a)] text-[var(--text,#eef2ff)] antialiased">
        <ParticlesBackdrop />
        <HeroSection />
        <HowItWorks />
        <FeaturesAndBenefits />
        <DualPerspective />
        <PlatformShowcase />
        <SecurityTech />
        <DemoGallery />
        <Testimonials />
        <FooterCTA />
      </div>
    </LazyMotion>
  );
}

// ---------------- Particles backdrop ----------------
function ParticlesBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20">
      <Particles
        options={{
          fpsLimit: 60,
          background: { color: "transparent" },
          particles: {
            number: { value: 50, density: { enable: true, area: 900 } },
            color: { value: ["#00ffd1", "#7c3aed", "#60a5fa"] },
            opacity: { value: 0.08, random: true },
            size: { value: 2.2, random: true },
            move: { enable: true, speed: 0.6, direction: "none", outModes: "out" },
            links: { enable: false },
          },
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
        }}
      />
    </div>
  );
}

// ---------------- Hero ----------------
function HeroSection() {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 700], [0, -140]);

  return (
    <header className="relative overflow-hidden h-screen flex items-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#00060b] via-[#021227] to-[#001726]" />

      <div className="max-w-7xl mx-auto w-full px-6 z-10">
        <motion.div style={{ y: titleY }} className="pt-28 lg:pt-36">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--brand,#00ffd1)] flex items-center justify-center font-bold text-black">Hire.</div>
            <div className="text-sm uppercase tracking-wide text-[var(--muted,#9fb0c8)]">Plataforma</div>
          </div>

          <motion.h1 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="mt-10 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            Contrate. Preste. Confie. <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand,#00ffd1)] to-[var(--accent,#7c3aed)]">Tudo em um só lugar.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.18 }} className="mt-6 max-w-3xl text-lg text-[var(--muted,#9fb0c8)]">
            Hire. conecta clientes e prestadores com contratos digitais, agendamento inteligente, proteção de pagamento e um fluxo projetado para conversão.
          </motion.p>

          <div className="mt-8 flex gap-4 items-center">
            <a href="#how" className="inline-flex items-center gap-3 rounded-full px-6 py-3 bg-[var(--brand,#00ffd1)] text-black font-semibold shadow-lg transform-gpu hover:scale-[1.02]">Ver demonstração</a>
            <a href="#auth" className="inline-flex items-center gap-3 rounded-full px-6 py-3 border border-[rgba(255,255,255,0.06)] text-[var(--muted,#9fb0c8)]">Entrar</a>
          </div>
        </motion.div>

        <div className="mt-12">
          <HeroMockupSet />
        </div>
      </div>

      <a href="#how" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted,#9fb0c8)] flex flex-col items-center gap-2">
        <FiChevronDown size={24} />
        <span className="text-xs">Role para continuar</span>
      </a>
    </header>
  );
}

function HeroMockupSet() {
  return (
    <div className="relative mt-8 w-full h-[420px] pointer-events-none">
      <div className="absolute left-0 top-8 w-[420px] h-[300px] rounded-2xl shadow-2xl transform-gpu rotate-6 scale-[0.98] overflow-hidden bg-gradient-to-br from-[#081028] to-[#022036] border border-[rgba(255,255,255,0.03)]">
        <img src="/assets/hero-1.png" alt="hero mock 1" className="w-full h-full object-cover" />
      </div>

      <div className="absolute right-0 top-20 w-[520px] h-[340px] rounded-2xl shadow-2xl -rotate-3 overflow-hidden bg-gradient-to-br from-[#07122a] to-[#001625] border border-[rgba(255,255,255,0.03)]">
        <img src="/assets/hero-2.png" alt="hero mock 2" className="w-full h-full object-cover" />
      </div>

      <div className="absolute left-1/2 top-36 -translate-x-1/2 w-[480px] h-[320px] rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#061228] to-[#00232f] border border-[rgba(255,255,255,0.04)]">
        <img src="/assets/hero-3.png" alt="hero mock 3" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

// ---------------- How it works (3-step interactive) ----------------
function HowItWorks() {
  return (
    <section id="how" className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold">Como funciona — em 3 passos</h2>
          <p className="mt-3 text-[var(--muted,#9fb0c8)] max-w-xl">Uma jornada simples e eficiente que transforma intenção em serviço concluído.</p>

          <div className="mt-8 space-y-6">
            <HowCard number={1} title="Publicar necessidade" body="Descreva o serviço, insira local e referências — o sistema sugere categorias e duração média automaticamente." />
            <HowCard number={2} title="Receber propostas" body="Prestadores enviarão propostas ricas com preço, tempo estimado e anexos — compare e converse no chat integrado." />
            <HowCard number={3} title="Fechar com segurança" body="Assine contrato digital, pague via escrow e acompanhe a execução com histórico e avaliações." />
          </div>
        </div>

        <div>
          <div className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.03)] shadow-lg">
            <img src="/assets/how-flow.png" alt="how it works" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HowCard({ number, title, body }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[var(--accent,#7c3aed)] grid place-items-center font-bold">{number}</div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-[var(--muted,#9fb0c8)]">{body}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------- Features & Benefits (many cards + advantages) ----------------
function FeaturesAndBenefits() {
  const features = [
    { k: "chat", t: "Chat integrado", d: "Converse, envie anexos e negocie sem sair da plataforma." },
    { k: "schedule", t: "Agendamento inteligente", d: "Duração média, buffers e integração com o calendário do prestador." },
    { k: "map", t: "Geo + CEP", d: "Busque profissionais por proximidade e raio de atuação." },
    { k: "contract", t: "Contrato digital", d: "Termos claros, assinatura integrada e histórico para auditoria." },
    { k: "payments", t: "Pagamento protegido", d: "Escrow que libera o pagamento após confirmação do serviço." },
    { k: "reviews", t: "Avaliações e portfólio", d: "Construa reputação com histórico, fotos e avaliações detalhadas." },
    { k: "reports", t: "Relatórios & financeiro", d: "Relatórios de faturamento e extrato para prestadores." },
    { k: "notifications", t: "Notificações inteligentes", d: "Alertas por push, e-mail e SMS para atualizações críticas." },
  ];

  return (
    <section className="py-20 bg-[linear-gradient(180deg,rgba(2,6,23,0.6),transparent)]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Recursos que geram valor</h2>
        <p className="mt-2 text-[var(--muted,#9fb0c8)] max-w-2xl">Cada funcionalidade foi desenhada para aumentar a confiança, reduzir atrito e acelerar a conversão.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.k} title={f.t} desc={f.d} />
          ))}
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <BenefitPanel side="client" />
          <BenefitPanel side="provider" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc }: any) {
  return (
    <motion.div whileHover={{ y: -6 }} className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-sm text-[var(--muted,#9fb0c8)]">{desc}</div>
      <div className="mt-4 text-xs text-[var(--muted,#8da6be)]">Vantagem: <span className="font-medium">{title.includes("Pagamento") ? "Segurança financeira" : "Redução de atrito"}</span></div>
    </motion.div>
  );
}

function BenefitPanel({ side }: any) {
  const clientBenefits = [
    { title: "Segurança", desc: "Contratos digitais e escrow protegem seu investimento." },
    { title: "Rapidez", desc: "Propostas e agendamento em minutos." },
    { title: "Confiança", desc: "Avaliações e histórico de trabalhos." },
  ];

  const providerBenefits = [
    { title: "Visibilidade", desc: "Seja encontrado por clientes na sua área." },
    { title: "Controle", desc: "Defina disponibilidade, preços e políticas." },
    { title: "Pagamento", desc: "Fluxo financeiro claro e relatórios." },
  ];

  const items = side === "client" ? clientBenefits : providerBenefits;
  const title = side === "client" ? "Vantagens para o cliente" : "Vantagens para o prestador";

  return (
    <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-[var(--muted,#9fb0c8)]">{side === "client" ? "O que o cliente ganha ao usar a Hire." : "O que o prestador ganha ao usar a Hire."}</p>

      <ul className="mt-6 space-y-4">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-[var(--brand,#00ffd1)] grid place-items-center font-bold">✓</div>
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-[var(--muted,#9fb0c8)]">{it.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Dual perspective (client vs provider narrative) ----------------
function DualPerspective() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-6 items-stretch">
        <div className="col-span-1">
          <h2 className="text-2xl font-bold">Duas perspectivas — mesmo objetivo</h2>
          <p className="mt-2 text-[var(--muted,#9fb0c8)]">A Hire. equilibra as necessidades de quem contrata e de quem presta — criando um ecossistema saudável.</p>
        </div>

        <PerspectiveCard title="Cliente" bullets={["Encontrar rápido","Comparar orçamentos","Garantia via contrato"]} img="/assets/perspective-client.png" />
        <PerspectiveCard title="Prestador" bullets={["Receber propostas","Controlar agenda","Saque transparente"]} img="/assets/perspective-provider.png" />
      </div>
    </section>
  );
}

function PerspectiveCard({ title, bullets, img }: any) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.02)]">
      <div className="p-6">
        <h3 className="font-semibold">{title}</h3>
        <ul className="mt-4 space-y-2 text-sm text-[var(--muted,#9fb0c8)]">
          {bullets.map((b: any, i: number) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
      </div>
      <div className="h-44 overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

// ---------------- Platform showcase (map/flow) ----------------
function PlatformShowcase() {
  return (
    <section className="py-20 bg-[linear-gradient(180deg,rgba(2,6,23,0.6),transparent)]">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">A plataforma por trás da conexão</h2>
          <p className="mt-3 text-[var(--muted,#9fb0c8)]">Um motor que combina localização, disponibilidade e reputação para entregar matchs relevantes.</p>

          <ul className="mt-6 space-y-4">
            <li className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)]">Algoritmo de relevância e filtros avançados</li>
            <li className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)]">Escrow e liberação de pagamento automática</li>
            <li className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)]">Monitoramento de qualidade e suporte</li>
          </ul>
        </div>

        <div>
          <div className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.03)] shadow-lg">
            <img src="/assets/platform-map.png" alt="platform map" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Security & Tech ----------------
function SecurityTech() {
  const items = [
    { t: "Criptografia", d: "Dados e comunicações protegidos com TLS e armazenamento seguro." },
    { t: "Logs e auditoria", d: "Transações e contratos deixam trilha para resolução de disputas." },
    { t: "Autenticação", d: "Suporte a SSO e verificação de identidade opcional para prestadores." },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">Segurança e tecnologia</h2>
          <p className="mt-2 text-[var(--muted,#9fb0c8)]">Tecnologia pensada para dar confiança e escalabilidade ao seu negócio.</p>

          <div className="mt-6 space-y-4">
            {items.map((it, i) => (
              <div key={i} className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
                <div className="font-semibold">{it.t}</div>
                <div className="text-sm text-[var(--muted,#9fb0c8)]">{it.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)]">
            <img src="/assets/security-diagram.png" alt="security" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Demo gallery / visual walkthrough ----------------
function DemoGallery() {
  const gallery = [
    "/assets/demo-1.png",
    "/assets/demo-2.png",
    "/assets/demo-3.png",
    "/assets/demo-4.png",
  ];

  return (
    <section className="py-20 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.6))]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold">Demonstração visual</h2>
        <p className="mt-2 text-[var(--muted,#9fb0c8)]">Screenshots e mockups do fluxo de contratação e execução.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((g, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.03)]">
              <img src={g} alt={`demo ${i + 1}`} className="w-full h-48 object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Testimonials ----------------
function Testimonials() {
  const quotes = [
    { name: "Camila", role: "Designer de interiores", quote: "Consegui meus primeiros 10 clientes em duas semanas com a Hire.!" },
    { name: "Marcos", role: "Consumidor", quote: "Nunca foi tão fácil encontrar um profissional confiável." },
    { name: "Ana", role: "Prestadora", quote: "A plataforma me deu previsibilidade e melhores propostas." },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">O que os usuários dizem</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
              <div className="text-lg">“{q.quote}”</div>
              <div className="mt-4 font-semibold">{q.name}</div>
              <div className="text-sm text-[var(--muted,#9fb0c8)]">{q.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Footer CTA / AuthPage ----------------
function FooterCTA() {
  return (
    <footer id="auth" className="py-28 bg-gradient-to-t from-[rgba(2,6,23,1)] to-transparent">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold">Entre e descubra a experiência completa</h2>
        <p className="mt-3 text-[var(--muted,#9fb0c8)]">Faça login para ver o walkthrough e acessar os dashboards demo (cliente e prestador).</p>

        <div className="mt-8 w-full max-w-md mx-auto">
          <AuthPage />
        </div>

        <div className="mt-6 text-sm text-[var(--muted,#9fb0c8)]">© {new Date().getFullYear()} Hire. — Plataforma de contratação e prestação de serviços</div>
      </div>
    </footer>
  );
}

// ---------------- End file ----------------
