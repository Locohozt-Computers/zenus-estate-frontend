import { IconBaseProps, IconType } from "react-icons";
import { FC, SVGProps } from "react";

export const AppIcon = ({
  render: Component,
  size,
  color,
  ...rest
}: IconBaseProps & {
  render: IconType | FC<SVGProps<SVGSVGElement>>;
}) => {
  return (
    <Component
      style={{ fontSize: size || 20, color: color || "var(--med-gray)" }}
      {...rest}
    />
  );
};
