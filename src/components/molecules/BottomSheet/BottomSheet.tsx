import React, { PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Sheet, SheetBackdrop } from "./style";

type Props = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  maxWidth?: number;
}>;

export const BottomSheet = ({ open, onClose, maxWidth, children }: Props) => {
  const [mounted, setMounted] = useState(open);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = window.setTimeout(() => setAnimateIn(true), 10);
      return () => window.clearTimeout(t);
    }
    setAnimateIn(false);
    const t = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  if (!mounted) return null;

  const target = document.getElementById("root-modal");
  if (!target) return null;

  return ReactDOM.createPortal(
    <SheetBackdrop open={animateIn} role="presentation" onClick={onClose}>
      <Sheet
        open={animateIn}
        maxWidth={maxWidth}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Sheet>
    </SheetBackdrop>,
    target
  );
};
