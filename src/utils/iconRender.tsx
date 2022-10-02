import { IconBaseProps, IconType } from "react-icons";
import { FC, SVGProps } from "react";
import { TextColor } from "components/atoms/Typography/style";

export const AppIcon = ({
  render: Component,
  size,
  color,
  textColor,
  ...rest
}: IconBaseProps & {
  textColor?: TextColor;
  render: IconType | FC<SVGProps<SVGSVGElement>>;
}) => {
  return (
    <Component
      style={{
        fontSize: size || 20,
        minWidth: size || 20,
        color: textColor ? `var(--${textColor})` : color ?? "var(--med-gray)",
      }}
      {...rest}
    />
  );
};
