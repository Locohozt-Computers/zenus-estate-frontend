import { ChangeEvent, CSSProperties } from "react";
import { BankAccountResI, BankRes } from "api";

export const formatNameToDisplay = (str?: string, nameOnly?: boolean) => {
  if (str) {
    const [initial, firstName, lastName] = str.split(" ");
    if (lastName) return `${!nameOnly ? initial : firstName} ${lastName}`;
    return `${!nameOnly ? initial : ""} ${lastName || firstName}`.trim();
  }
  return str || "--";
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

export const getInitials = (name: string, count = 2) => {
  if (name) {
    return name
      .split(" ")
      .slice(0, count)
      .map((el) => el[0].toUpperCase())
      .join("")
      .trim();
  }
  return "-";
};

export const currencyFormat = (
  num: number,
  symbol: "$" | "₦" | string = "₦"
) => {
  return `${symbol?.trim() ?? ""} ${num
    .toFixed(2)
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

export const getStatusColor = (status: string) => {
  const fn = (c: string) => hexToHSL(c, 10);
  switch (status) {
    case "failed":
      return { bg: fn("#ff006e"), text: "var(--pink)" };
    case "processing":
      return { bg: fn("#003085"), text: "var(--blue)" };
    case "completed":
      return { bg: fn("#007416"), text: "var(--green)" };
    default:
      return { bg: fn("#003085"), text: "var(--blue)" };
  }
};

export const getBalColor = (bal: number) => {
  if (bal < 0) return "var(--pink)";
  if (bal === 0) return "var(--blue)";
  return "var(--green)";
};

/**
 * Omit list of keys from object if they exist
 * @param obj
 * @param remove
 */
export const omit = <T extends { [p in string]: any }>(
  obj: T,
  remove: string[]
): T => {
  const copyObj: any = { ...obj };
  if (remove.length) {
    remove.forEach((key) => delete copyObj[key]);
    return { ...copyObj };
  }
  return copyObj;
};

/**
 * Pick keys from object
 * @param obj
 * @param keep
 */
export const pick = <T extends { [p in string]: any }>(
  obj: T,
  keep: string[]
): T => {
  return keep.reduce((res: any, cur) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(cur)) {
      res[cur] = obj[cur];
    }
    return res;
  }, {});
};

export const excludeObjectEmptyValues = <T extends object>(obj: T) => {
  return Object.entries(obj).reduce(
    (res: Partial<Record<string, any>>, [key, value]) => {
      if (value) res[key] = value;
      return res;
    },
    {}
  );
};

export const strToNumOnly = (str: string) => {
  if (str.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
    return str;
  }
  return "";
};

export const getBankDetails = (
  banks?: BankRes[],
  bankAccounts?: BankAccountResI[]
) => {
  if (bankAccounts && banks) {
    const res = banks?.find(
      (el) => el.code.toString() === bankAccounts[0].bank_code.toString()
    );
    return {
      bank: res?.name,
      account: bankAccounts[0].account_name,
      acc_number: bankAccounts[0].account_number,
    };
  }
  return null;
};

export const formatPhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
  const cleaned = `${event.target.value}`.replace(/\D/g, "");
  let match = cleaned.match(/^(234|)+?(\d{3})(\d{3})(\d{4})$/);
  if (cleaned.length === 11) {
    match = cleaned.match(/^(234|)+?(\d{4})(\d{3})(\d{4})$/);
  }
  if (match) {
    const intlCode = match[1] ? "+234 " : "";
    event.target.value = [
      intlCode,
      "(",
      match[2],
      ") ",
      match[3],
      " - ",
      match[4],
    ].join("");
    return event;
  }
  event.target.value = cleaned;
  return event;
};
