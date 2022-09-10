import toast, { Toast, ToastOptions } from "react-hot-toast";
import styled from "styled-components/macro";
import { CgClose } from "react-icons/cg";

const Styling = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .content {
    display: flex;
    flex-wrap: wrap;
  }

  > button {
    background: var(--blue);
    width: 20px;
    height: 20px;
    color: white;
    cursor: pointer;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const NotificationBody = ({
  toastInstance: t,
  message,
}: {
  toastInstance: Toast;
  message: any;
}) => {
  return (
    <Styling>
      <div>{message}</div>
      <button type="button" onClick={() => toast.dismiss(t.id)}>
        <CgClose />
      </button>
    </Styling>
  );
};

interface NotificationType {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const success = (message: string, options?: ToastOptions) => {
  return toast.success(message, options);
};
const error = (message: string, options?: ToastOptions) => {
  return toast.error(message, options);
};

const info = (message: string, options?: ToastOptions) => {
  return toast(
    (t) => <NotificationBody message={message} toastInstance={t} />,
    options
  );
};

export const notification: NotificationType = {
  ...toast,
  success,
  error,
  info,
};
