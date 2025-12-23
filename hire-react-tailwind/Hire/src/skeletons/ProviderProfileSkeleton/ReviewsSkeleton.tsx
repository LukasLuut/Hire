export const ReviewsSkeleton = () => {
  return (
    <div className="mt-4 rounded-2xl p-4 border border-[var(--border)] bg-[var(--bg-light)]/30 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-40 bg-white/10 rounded" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-white/5 space-y-2">
            <div className="h-3 w-1/3 bg-white/10 rounded" />
            <div className="h-2 w-full bg-white/5 rounded" />
            <div className="h-2 w-5/6 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};
