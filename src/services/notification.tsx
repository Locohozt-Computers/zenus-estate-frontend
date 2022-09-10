import toast, { Toast, ToastOptions } from "react-hot-toast";
import styled from "styled-components/macro";
import { CgClose } from "react-icons/cg";
import { HTMLAttributes } from "react";

const Styling = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;

  .content {
    display: flex;
    flex-wrap: wrap;
  }

  > button {
    background: white;
    width: 20px;
    min-width: 20px;
    height: 20px;
    min-height: 20px;
    color: var(--blue);
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
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  toastInstance: Toast;
  message: any;
}) => {
  return (
    <Styling {...rest}>
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
  return toast(
    (t) => <NotificationBody message={message} toastInstance={t} />,
    {
      ...options,
      style: {
        ...options?.style,
        backgroundColor: "var(--green)",
      },
    }
  );
};
const error = (message: string, options?: ToastOptions) => {
  return toast(
    (t) => <NotificationBody message={message} toastInstance={t} />,
    {
      ...options,
      style: {
        ...options?.style,
        backgroundColor: "var(--pink)",
      },
    }
  );
};

const info = (message: string, options?: ToastOptions) => {
  return toast(
    (t) => <NotificationBody message={message} toastInstance={t} />,
    {
      ...options,
      style: {
        ...options?.style,
        backgroundColor: "var(--blue)",
      },
    }
  );
};

export const notification: NotificationType = {
  ...toast,
  success,
  error,
  info,
};
