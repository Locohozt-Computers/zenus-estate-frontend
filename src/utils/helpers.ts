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
  num: number,
  symbol: "$" | "₦" | string = "₦"
) => {
  return `${symbol?.trim() ?? ""} ${num
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`.trim();
};

currencyFormat.removeFormat = (str: string, sym = "₦"): number => {
  return +str.replace(sym, "").replace(/[₦ ,]/g, "");
};

export const hexToHSL = (hex: string, lighten?: number | string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.toString().trim()
  );

  if (result) {
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      // eslint-disable-next-line default-case
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    s *= 100;
    s = Math.round(s);
    l *= 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    if (lighten) {
      return `hsl(${h}, ${s}%, ${l}%, ${
        typeof lighten === "number" ? lighten / 100 : lighten
      })`;
    }
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  return hex;
};

// @ts-ignore
window.hexToHSL = hexToHSL;
