export const PostCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse">
      {/* imagem */}
      <div className="h-40 w-full rounded-xl bg-white/10 mb-4" />

      {/* título */}
      <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />

      {/* categoria */}
      <div className="h-3 w-1/3 bg-white/5 rounded mb-3" />

      {/* descrição */}
      <div className="space-y-2 mb-4">
        <div className="h-2 w-full bg-white/5 rounded" />
        <div className="h-2 w-5/6 bg-white/5 rounded" />
        <div className="h-2 w-4/6 bg-white/5 rounded" />
      </div>

      {/* footer */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-16 bg-white/10 rounded" />
        <div className="h-8 w-24 bg-white/10 rounded-full" />
      </div>
    </div>
  );
};
