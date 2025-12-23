export const ProviderShortcutsSkeleton = () => {
  return (
    <aside className="w-full lg:w-80">
      <div className="hidden lg:block rounded-2xl p-4 border border-[var(--border)] bg-[var(--bg-light)]/40 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="h-3 w-16 bg-white/5 rounded" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-white/10" />
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-3 w-40 bg-white/5 rounded" />
          <div className="h-3 w-32 bg-white/5 rounded" />
        </div>
      </div>

      {/* mobile accordion button */}
      <div className="lg:hidden h-14 rounded-2xl bg-white/10 animate-pulse mt-4" />
    </aside>
  );
};
