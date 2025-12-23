export const ServiceCardSkeleton = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.015))] animate-pulse">
      {/* imagem */}
      <div className="h-48 w-full bg-white/5" />

      <div className="p-4 space-y-3">
        {/* provider */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
          <div className="w-12 h-12 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/2 bg-white/10 rounded" />
            <div className="h-2 w-3/4 bg-white/5 rounded" />
          </div>
        </div>

        {/* title */}
        <div className="h-4 w-3/4 bg-white/10 rounded" />

        {/* description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
        </div>

        {/* price + duration */}
        <div className="flex justify-between pt-2">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded" />
        </div>

        {/* button */}
        <div className="h-8 w-28 bg-white/10 rounded-full ml-auto" />
      </div>
    </div>
  );
};
