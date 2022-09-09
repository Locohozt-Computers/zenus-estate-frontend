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

export const truncateFileName = (str: string) => {
  const parts = str.split(".");
  const name = parts.slice(0, parts.length - 1).join(".");
  const ending = parts[parts.length - 1];
  if (name.length < 11) return str;
  return `${name.slice(0, 4)}...${name.slice(name.length - 5)}.${ending}`;
};

export const truncateLongName = (str: string) => {
  const parts = str.split(",");
  const name = parts.slice(0, parts.length - 1).join(",");
  const ending = parts[parts.length - 1];
  if (name.length < 11) return str;
  return `${name.slice(0, 4)}...${name.slice(name.length - 5)}.${ending}`;
};

export const getInitials = (name: string) => {
  return name ? `${name[0].toUpperCase()}`.trim() : "-";
};

export const currencyFormat = (
  num: number | string,
  symbol: "$" | "₦" | string = "₦"
) => {
  return `${symbol?.trim() ?? ""} ${num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`.trim();
};

currencyFormat.removeFormat = (str: string, sym = "₦"): number => {
  return +str.replace(sym, "").replace(/[₦ ,]/g, "");
};

// @ts-ignore
window.cur = currencyFormat;
