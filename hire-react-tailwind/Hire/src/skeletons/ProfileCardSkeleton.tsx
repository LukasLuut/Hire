export default function ProfileCardSkeleton() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center gap-6 bg-[var(--bg-dark)] p-8 animate-pulse">
  
  {/* IMAGEM DE PERFIL */}
  <div className="relative">
    <div className="w-70 h-70 rounded-full bg-[var(--bg-light)] border-4 border-[var(--primary)]" />

    {/* Botão de edição */}
    <div className="absolute bottom-1 right-0 w-9 h-9 rounded-full bg-[var(--primary)] opacity-60" />
  </div>

  {/* INFORMAÇÕES DO PERFIL */}
  <div className="w-full max-w-2xl">
    
    {/* Nome + Avaliação */}
    <div className="flex items-center gap-4 flex-wrap">
      <div className="h-8 w-60 bg-[var(--bg-light)] rounded-md" />

      <div className="flex items-center gap-2">
        <div className="h-5 w-24 bg-[var(--bg-light)] rounded-md" />
        <div className="h-4 w-32 bg-[var(--bg-light)] rounded-md" />
      </div>
    </div>

    {/* SOBRE */}
    <section className="p-5 pb-10 flex flex-col">
      <div className="h-6 w-24 bg-[var(--bg-light)] rounded-md mb-3" />

      <div className="space-y-2">
        <div className="h-4 w-full bg-[var(--bg-light)] rounded-md" />
        <div className="h-4 w-full bg-[var(--bg-light)] rounded-md" />
        <div className="h-4 w-2/3 bg-[var(--bg-light)] rounded-md" />
      </div>

      {/* Email */}
      <div className="h-8 w-64 bg-[var(--bg-light)] rounded-md mt-5" />
    </section>

    {/* BOTÕES */}
    <div className="flex items-end gap-4 mt-2">
      <div className="h-14 w-56 bg-[var(--bg-light)] rounded-xl" />
      <div className="h-14 w-28 bg-[var(--bg-light)] rounded-lg" />
    </div>

  </div>
</section>

  )
}
