import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import type { JSX } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const typeConfig: Record<
  ToastType,
  { border: string; icon: JSX.Element }
> = {
  success: {
    border: 'border-l-[var(--success)]',
    icon: <CheckCircle size={18} className="text-[var(--success)]" />,
  },
  error: {
    border: 'border-l-[var(--danger)]',
    icon: <XCircle size={18} className="text-[var(--danger)]" />,
  },
  warning: {
    border: 'border-l-[var(--warning)]',
    icon: <AlertTriangle size={18} className="text-[var(--warning)]" />,
  },
  info: {
    border: 'border-l-[var(--info)]',
    icon: <Info size={18} className="text-[var(--info)]" />,
  },
};

export function Toast({ message, type }: ToastProps) {
  const { border, icon } = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.97 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`
        min-w-[320px]
        max-w-sm
        rounded-2xl
        bg-gradient-to-br
        from-[var(--bg-light)]
        to-[var(--bg)]
        border
        border-[var(--border)]
        border-l-4
        ${border}
        px-4
        py-3
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        backdrop-blur-sm
        hover:scale-[1.01]
        transition-transform
        mt-15
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>

        <p className="text-sm text-[var(--text)] leading-snug">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
