import React, { useEffect, useRef } from "react";

const ScrollList: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateEffects = () => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const items = container.querySelectorAll<HTMLDivElement>(".scroll-list__item");

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    items.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = containerCenter - itemCenter;
      const ratio = Math.max(-1, Math.min(1, distance / (containerRect.height / 2)));

      // Efeito 3D simplificado
      const scale = 0.7 + 0.6 * (1 - Math.abs(ratio));
      const translateY = distance * 0.25;
      const opacity = 0.3 + 0.7 * (1 - Math.abs(ratio));
      const zIndex = Math.round(100 - Math.abs(ratio) * 100);
      const boxShadow =
        Math.abs(ratio) < 0.05
          ? "0 10px 20px rgba(0,0,0,0.5)"
          : "0 4px 10px rgba(0,0,0,0.3)";

      item.style.transform = `translateY(${translateY}px) scale(${scale})`;
      item.style.opacity = `${opacity}`;
      item.style.zIndex = `${zIndex}`;
      item.style.boxShadow = boxShadow;
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateEffects();
    container.addEventListener("scroll", updateEffects);
    window.addEventListener("resize", updateEffects);

    return () => {
      container.removeEventListener("scroll", updateEffects);
      window.removeEventListener("resize", updateEffects);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
      <div
        ref={scrollRef}
        className="w-[360px] gap-20 h-[360px] overflow-y-scroll rounded-[16px] scroll-smooth bg-[var(--bg)] p-2 no-scrollbar"
      >
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="scroll-list__item h-[50px]  my-[25px] mx-[25px] rounded-[12px] bg-gradient-to-b from-[#3a86ff] to-[#265cc5] border-1 border-[var(--border)] transition-all duration-200"
          />
        ))}
      </div>

      {/* Scrollbar invisível com Tailwind custom */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ScrollList;
