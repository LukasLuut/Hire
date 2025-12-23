export const BookingsSkeleton = () => {
  return (
    <div className="rounded-2xl p-4 border border-[var(--border)] bg-[var(--bg-light)]/30 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-40 bg-white/10 rounded" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-2 rounded-lg bg-white/5">
            <div className="w-10 h-10 rounded-md bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 bg-white/10 rounded" />
              <div className="h-2 w-1/2 bg-white/5 rounded" />
              <div className="h-2 w-2/3 bg-white/5 rounded" />
            </div>
            <div className="w-14 h-3 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-4 h-10 rounded-lg bg-white/10" />
    </div>
  );
};
