import toast, { ToastOptions } from "react-hot-toast";

interface NotificationType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string) => void;
}

const success = (message: string, options?: ToastOptions) => {
  return toast.success(message, options);
};
const error = (message: string, options?: ToastOptions) => {
  return toast.error(message, options);
};

export const notification: NotificationType = {
  ...toast,
  success,
  error,
};
