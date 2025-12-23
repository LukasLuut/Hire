export const ProviderHeroSkeleton = () => {
  return (
    <div className="flex-1 rounded-2xl p-6 border border-[var(--border)] bg-[var(--bg-light)]/30 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-28 h-28 rounded-full bg-white/10" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-1/3 bg-white/10 rounded" />
          <div className="h-4 w-1/4 bg-white/5 rounded" />
          <div className="h-3 w-2/3 bg-white/5 rounded" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
};
