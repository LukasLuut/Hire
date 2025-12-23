import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast } from './Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  function showToast(message: string, type: ToastType = 'info') {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() =>
                setToasts((prev) =>
                  prev.filter((t) => t.id !== toast.id)
                )
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
}
