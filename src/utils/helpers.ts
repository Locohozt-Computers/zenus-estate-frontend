import { CSSProperties } from "react";

export const formatNameToDisplay = (firstName?: string, lastName?: string) => {
  return `${firstName || ""} ${lastName || ""}`.trim();
};

export const cssObjectToString = (obj: CSSProperties) => {
  return Object.entries(obj)
    .map(([key, value]) => {
      return `${key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase()}:${value}`;
    })
    .join(";");
};
