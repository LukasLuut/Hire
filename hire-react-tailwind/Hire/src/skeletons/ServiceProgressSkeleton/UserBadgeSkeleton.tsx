export const UserBadgeSkeleton = () => {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      {/* Avatar skeleton */}
      <div className="w-12 h-12 rounded-full bg-[var(--bg-light)] border border-[var(--border)]" />

      {/* Text skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-28 rounded bg-[var(--bg-light)]" />
        <div className="h-3 w-20 rounded bg-[var(--bg-light)]" />
      </div>
    </div>
  );
}
