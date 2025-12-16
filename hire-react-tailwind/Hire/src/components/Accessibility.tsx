import  { useEffect, useState, useRef } from "react";
import { Accessibility } from "lucide-react";




/**
 * HomeAccessibility.tsx
 * Componente React + TypeScript que adiciona um botão flutuante no canto esquerdo
 * com um painel de acessibilidade contendo controles comuns (font-size, contraste,
 * espaçamento de texto, fonte "dyslexia-friendly", redução de movimento, grayscale,
 * foco visível e "skip to content").
 *
 * Requisitos/assunções:
 * - Tailwind CSS está disponível no projeto.
 * - Para a fonte 'dyslexia-friendly' você pode adicionar uma font-face ou usar uma
 *   font-family alternativa (ex.: "OpenDyslexic"). No exemplo, eu adiciono uma
 *   classe `font-dyslexia` que você deve definir no CSS global.
 *
 * Como usar:
 * - Importe e coloque <HomeAccessibility /> na sua página Home (por exemplo, dentro de App.tsx).
 * - O componente persiste preferências em localStorage (chave: accessibilityPrefs).
 */

type Prefs = {
  fontSize: number; // 100 as base (percent)
  highContrast: boolean;
  grayscale: boolean;
  dyslexiaFont: boolean;
  textSpacing: boolean;
  lineHeight: number; // multiplier, e.g. 1.4
  reduceMotion: boolean;
  showFocusOutline: boolean;
};

const DEFAULT_PREFS: Prefs = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  dyslexiaFont: false,
  textSpacing: false,
  lineHeight: 1.4,
  reduceMotion: false,
  showFocusOutline: true,
};

const STORAGE_KEY = "accessibilityPrefs";

export default function Acessibility() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Apply preferences to the document root when prefs change
  useEffect(() => {
    applyPreferences(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  // Close panel on outside click or ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      // Alt+A opens/closes the panel for quick keyboard access
      if ((e.altKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setOpen((v) => !v);
        // focus the panel when opening
        setTimeout(() => panelRef.current?.focus(), 0);
      }
    }
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (open && !panelRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDocClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDocClick);
    };
  }, [open]);

  // Helper to update a single preference
  function updatePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  // Reset to defaults
  function resetPrefs() {
    setPrefs(DEFAULT_PREFS);
  }

  return (
    <>
      {/* Skip link - highly recommended for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:translate-y-0 focus:px-4 focus:py-2 focus:bg-white focus:text-black">Pular para o conteúdo</a>

      {/* Floating accessibility button - fixed left middle */}
      <button
        ref={buttonRef}
        aria-expanded={open}
        aria-controls="accessibility-panel"
        aria-label={open ? "Fechar painel de acessibilidade" : "Abrir painel de acessibilidade"}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="fixed left-4 top-1/2 z-50  flex items-center justify-center w-12 h-12 rounded-lg shadow-lg border-2 border-[var(--border)] bg-[var(--bg-light)]  focus:outline-none focus-visible:ring-4"
      >
        {/* Icon: accessibility (simple) */}
       <Accessibility className="w-6 h-6 text-[var(--primary)]" aria-hidden="true" />
        <span className="sr-only">Acessibilidade</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Painel de acessibilidade"
          tabIndex={-1}
          className="fixed left-20 top-1/4 z-50 w-80 max-w-xs rounded-lg bg-[var(--bg-light)] shadow-2xl p-4 border border-[var(--border)] focus:outline-none"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-[var(--text)] font-semibold">Acessibilidade</h3>
            <div>
              <button onClick={() => setOpen(false)} aria-label="Fechar painel" className="p-1 rounded focus:outline-none focus-visible:ring-2">
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Font size */}
            <div>
              <label className="block text-sm text-[var(--text)] font-medium">Tamanho da fonte</label>
              <div className="flex items-center gap-2 mt-1">
                <button
                  className="px-2 py-1 text-[var(--text)] rounded border"
                  onClick={() => updatePref("fontSize", Math.max(80, prefs.fontSize - 10))}
                  aria-label="Diminuir fonte"
                >
                  A-
                </button>
                <div className="flex-1 text-[var(--text)] text-center">{prefs.fontSize}%</div>
                <button
                  className="px-2 py-1 text-[var(--text)] rounded border"
                  onClick={() => updatePref("fontSize", Math.min(200, prefs.fontSize + 10))}
                  aria-label="Aumentar fonte"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line height */}
            <div>
              <label className="block text-sm text-[var(--text)] font-medium">Altura da linha</label>
              <input
                aria-label="Altura da linha"
                type="range"
                min={1}
                max={2}
                step={0.1}
                value={prefs.lineHeight}
                onChange={(e) => updatePref("lineHeight", Number(e.target.value))}
                className="w-full mt-1"
              />
              <div className="text-sm text-[var(--text)]">{prefs.lineHeight.toFixed(1)}x</div>
            </div>

            {/* Text spacing */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Espaçamento do texto</span>
              <input type="checkbox" checked={prefs.textSpacing} onChange={(e) => updatePref("textSpacing", e.target.checked)} aria-label="Ativar espaçamento do texto" />
            </div>

            {/* Dyslexia-friendly font */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Fonte amigável (dislexia)</span>
              <input type="checkbox" checked={prefs.dyslexiaFont} onChange={(e) => updatePref("dyslexiaFont", e.target.checked)} aria-label="Ativar fonte amigável" />
            </div>

            {/* High contrast */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Alto contraste</span>
              <input type="checkbox" checked={prefs.highContrast} onChange={(e) => updatePref("highContrast", e.target.checked)} aria-label="Ativar alto contraste" />
            </div>

            {/* Grayscale */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Escala de cinza</span>
              <input type="checkbox" checked={prefs.grayscale} onChange={(e) => updatePref("grayscale", e.target.checked)} aria-label="Ativar escala de cinza" />
            </div>

            {/* Reduce motion */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Reduzir movimento</span>
              <input type="checkbox" checked={prefs.reduceMotion} onChange={(e) => updatePref("reduceMotion", e.target.checked)} aria-label="Reduzir movimento" />
            </div>

            {/* Focus outline */}
            <div className="flex items-center text-[var(--text)] justify-between">
              <span>Realçar foco</span>
              <input type="checkbox" checked={prefs.showFocusOutline} onChange={(e) => updatePref("showFocusOutline", e.target.checked)} aria-label="Mostrar foco visível" />
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={resetPrefs} className="flex-1 px-3 py-2 text-[var(--text)] rounded border">Restaurar</button>
              <a href="#main-content" className="flex-1 px-3 py-2 rounded bg-[var(--primary)] text-[var(--text)] text-center">Pular para conteúdo</a>
            </div>

            <div className="text-xs text-slate-500">Atalho: Alt + A para abrir/fechar</div>
          </div>
        </div>
      )}
    </>
  );
}


/* =========================
   Helpers: aplicar preferências
   ========================= */
function applyPreferences(prefs: Prefs) {
  const root = document.documentElement;

  // Font size as percentage
  root.style.fontSize = `${prefs.fontSize}%`;

  // Line height and text spacing
  root.style.setProperty("--site-line-height", String(prefs.lineHeight));
  if (prefs.textSpacing) {
    root.style.setProperty("--site-letter-spacing", "0.12em");
    root.style.setProperty("--site-word-spacing", "0.35em");
  } else {
    root.style.setProperty("--site-letter-spacing", "normal");
    root.style.setProperty("--site-word-spacing", "normal");
  }

  // High contrast and grayscale toggles via classes
  toggleClass(root, "a11y-high-contrast", prefs.highContrast);
  toggleClass(root, "a11y-grayscale", prefs.grayscale);
  toggleClass(root, "a11y-dyslexia-font", prefs.dyslexiaFont);
  toggleClass(root, "a11y-reduce-motion", prefs.reduceMotion);
  toggleClass(root, "a11y-focus-outline", prefs.showFocusOutline);

  // If reduce-motion: set prefers-reduced-motion override via style (best effort)
  if (prefs.reduceMotion) {
    root.style.setProperty("scroll-behavior", "auto");
  } else {
    root.style.removeProperty("scroll-behavior");
  }
}

function toggleClass(el: HTMLElement, className: string, on: boolean) {
  if (on) el.classList.add(className);
  else el.classList.remove(className);
}
