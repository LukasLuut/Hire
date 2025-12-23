import { ServiceCardSkeleton } from "./ServiceCardSkeleton";
import { ServicesHeaderSkeleton } from "./ServicesHeaderSkeleton";
import { TopProvidersSkeleton } from "./TopProvidersSkeleton";

export const ServicesPageSkeleton = () => {
  return (
    <div className="max-w-full sm:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 md:mt-8">
      <section>
        <ServicesHeaderSkeleton />

        <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </section>

      <TopProvidersSkeleton />
    </div>
  );
};
