export const SearchBarSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 mb-8 animate-pulse">
      {/* input */}
      <div className="w-full max-w-2xl h-12 rounded-full bg-white/10" />

      {/* tags */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-white/5"
          />
        ))}
      </div>

      {/* filtros */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 bg-white/5 px-6 py-3 rounded-2xl">
        <div className="h-6 w-40 bg-white/10 rounded" />
        <div className="h-6 w-48 bg-white/10 rounded" />
      </div>
    </div>
  );
};
