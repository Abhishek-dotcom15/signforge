import toast, { Toaster as HotToaster } from "react-hot-toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export { toast };

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: "!bg-[var(--bg-primary)] !text-[var(--text-primary)] !border !border-[var(--border-default)] !shadow-lg !rounded-lg",
        success: {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        },
        error: {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          duration: 5000,
        },
      }}
    />
  );
}

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) =>
    toast(message, { icon: <Info className="h-5 w-5 text-blue-500" /> }),
  promise: <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => toast.promise(promise, msgs),
};
