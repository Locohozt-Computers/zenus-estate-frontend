import { usePaystackPayment } from "react-paystack";
import { Button, ButtonProps } from "components";
import { callback, PaystackProps } from "react-paystack/dist/types";
import { PropsWithChildren } from "react";
import { PayStackResponseI } from "api";
import clsx from "clsx";

interface PayStackButtonProps extends PaystackProps {
  onSuccess?: (response?: PayStackResponseI) => void;
  onClose?: callback;
  buttonProps?: ButtonProps;
}

export const CustomPayStackButton = ({
  children,
  onSuccess,
  onClose,
  buttonProps,
  ...others
}: Partial<PropsWithChildren<PayStackButtonProps>>): JSX.Element => {
  const initializePayment = usePaystackPayment({
    ...others,
    publicKey: process.env.REACT_APP_PAYSTACK_KEY as string,
  } as PaystackProps);
  return (
    <Button
      className={clsx("paystack-button", buttonProps?.className as string)}
      text={buttonProps?.text}
      {...buttonProps}
      onClick={(): void => initializePayment(onSuccess, onClose)}
    >
      {children}
    </Button>
  );
};
