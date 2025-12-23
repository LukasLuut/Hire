import { PostCardSkeleton } from "../ServiceGallerySkeleton/PostCardSkeleton";
import { SearchBarSkeleton } from "../ServiceGallerySkeleton/SearchBarSkeleton";
import { TitleSkeleton } from "../ServiceGallerySkeleton/TitleSkeleton";
import { BookingsSkeleton } from "./BookingsSkeleton";
import { ProviderHeroSkeleton } from "./ProviderHeroSkeleton";
import { ProviderShortcutsSkeleton } from "./ProviderShortcutsSkeleton";
import { ReviewsSkeleton } from "./ReviewsSkeleton";

export const ProviderProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-25 px-4 sm:px-6 md:px-8 lg:px-10 py-6">
      <div className="max-w-[90%] mx-auto flex flex-col lg:flex-row gap-6">
        <ProviderHeroSkeleton />
        <ProviderShortcutsSkeleton />
      </div>
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
      <div className="max-w-[90%] mx-auto mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div />
        <aside>
          <BookingsSkeleton />
          <ReviewsSkeleton />
        </aside>
      </div>
    </div>
  );
};
