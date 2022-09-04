import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { ReactComponent as Loader } from "assets/images/btn-loader.svg";
import { ButtonLoader, ButtonWrapper } from "./style";

interface ButtonProps extends PropsWithChildren {
  text?: string;
  loading?: { loader: any; state: boolean } | boolean;
  secondary?: boolean;
}

export const Button = ({
  children,
  text,
  loading,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <ButtonWrapper
      btnDisable={!!loading}
      aria-label={loading ? "loading" : undefined}
      type="button"
      {...rest}
    >
      {loading && (
        <ButtonLoader>
          {typeof loading === "boolean" && (
            <Loader style={{ width: 40, maxHeight: 40 }} />
          )}
          {typeof loading === "object" && loading.state ? loading.loader : null}
        </ButtonLoader>
      )}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>
        {text || children}
      </span>
    </ButtonWrapper>
  );
};
