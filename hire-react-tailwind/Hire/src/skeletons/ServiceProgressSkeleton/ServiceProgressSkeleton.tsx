import { UserBadgeSkeleton } from "./UserBadgeSkeleton";

export const ServiceProgressSkeleton = () => {
  return (
    <div className="w-full p-6 mt-20 md:p-10 bg-[var(--bg-light)] rounded-2xl border border-[var(--border)] shadow-lg animate-pulse">
      <div className="flex flex-col md:flex-row md:justify-between gap-10">
        {/* LEFT ------------------------------------------------ */}
        <div className="flex-1">
          {/* HEADER */}
          <header className="flex flex-col gap-3 md:mt-10 max-w-[500px]">
            <div className="h-8 w-72 rounded bg-[var(--bg-dark)]" />
            <div className="h-3 w-40 rounded bg-[var(--bg-dark)]" />
          </header>

          {/* USERS */}
          <div className="flex items-center gap-6 mb-6 mt-10">
            <UserBadgeSkeleton />
            <div className="h-3 w-6 rounded bg-[var(--bg-dark)]" />
            <UserBadgeSkeleton />
          </div>

          {/* TIMELINE */}
          <section className="mb-6">
            <div className="flex gap-6 items-center overflow-x-auto py-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[120px] gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-dark)]" />
                  <div className="h-4 w-20 rounded bg-[var(--bg-dark)]" />
                  <div className="h-3 w-14 rounded bg-[var(--bg-dark)]" />
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS */}
          <section className="mb-6">
            <div className="h-5 w-24 rounded bg-[var(--bg-dark)] mb-4" />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-12 w-48 rounded-xl bg-[var(--bg-dark)]" />
              <div className="h-12 w-48 rounded-xl bg-[var(--bg-dark)]" />
            </div>
          </section>
        </div>

        {/* SIDEBAR --------------------------------------------- */}
        <aside className="relative flex flex-col items-end gap-6 min-w-[280px]">
          {/* STATUS */}
          <div className="absolute top-11 left-5">
            <div className="h-6 w-32 rounded-full bg-[var(--bg-dark)]" />
          </div>

          {/* POST CARD */}
          <div className="w-full rounded-2xl border border-[var(--border)] p-5 bg-[var(--bg-dark)] space-y-4">
            <div className="h-5 w-3/4 rounded bg-[var(--bg-light)]" />
            <div className="h-4 w-full rounded bg-[var(--bg-light)]" />
            <div className="h-4 w-5/6 rounded bg-[var(--bg-light)]" />
            <div className="h-32 w-full rounded-xl bg-[var(--bg-light)]" />
          </div>
        </aside>
      </div>
    </div>
  );
}
