import { PostCardSkeleton } from "./PostCardSkeleton";
import { SearchBarSkeleton } from "./SearchBarSkeleton";
import { TitleSkeleton } from "./TitleSkeleton";

export const ServicesGallerySkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] overflow-x-hidden px-6 md:px-20 text-[var(--text)]/80">
      
      {/* título */}
      <TitleSkeleton />

      {/* busca + filtros */}
      <SearchBarSkeleton />

      {/* grid */}
      <div className="grid -ml-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        {Array.from({ length: 9 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
