export const TopProvidersSkeleton = () => {
  return (
    <aside className="hidden lg:block sticky top-24 self-start">
      <div className="w-80 rounded-2xl p-4 border border-[var(--border)] bg-[var(--bg-light)]/40 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="h-3 w-10 bg-white/5 rounded" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
            >
              <div className="w-12 h-12 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 bg-white/10 rounded" />
                <div className="h-2 w-3/4 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
