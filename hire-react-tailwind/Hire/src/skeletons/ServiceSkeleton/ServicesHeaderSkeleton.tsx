export const ServicesHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between mb-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-white/10 rounded" />
        <div className="h-3 w-32 bg-white/5 rounded" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-8 w-36 bg-white/10 rounded-full" />
        <div className="h-4 w-20 bg-white/5 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-white/10 rounded-lg" />
          <div className="h-8 w-8 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
