import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ theme, setTheme }: { theme: string; setTheme: (t: "dark"|"light") => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = ["Home", "Business", "Perfil"];
  const navigate = useNavigate();

  return (
    <nav className="fixed w-full z-50 bg-[var(--bg-dark)]/70 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-xl font-bold text-[var(--text)]">Hire.</div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            
            <a
              onClick={()=>navigate(link.toLowerCase())}
              key={link}
              href={`${link.toLowerCase()}`}
              className="text-[var(--text)] hover:text-[var(--highlight)] transition"
            >
              {link}
            </a>
          ))}

          {/* Toggle Theme */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
           className="fixed top-3 right-40 z-50 p-2 rounded-full border border-[var(--border)] 
                 bg-[var(--bg-light)] text-[var(--text)] transition hover:text-[var(--text)] 
                 hover:border-[var(--highlight)] shadow-lg"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-full text-[var(--text)] border border-[var(--border)] bg-[var(--bg-light)] transition"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-[var(--bg-dark)]/95 backdrop-blur-md border-t border-[var(--border)] flex flex-col gap-4 px-6 py-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[var(--text)] hover:text-[var(--highlight)] transition py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </a>
            ))}

            {/* Toggle Theme */}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                setMobileOpen(false);
              }}
              className="mt-2 p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-text)] transition flex items-center justify-center"
            >
              {theme === "dark" ? <Sun className="ml-2 text-[var(--text)]" size={20} /> : <Moon size={20} />}
              <span className="ml-2 text-[var(--text)]">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
