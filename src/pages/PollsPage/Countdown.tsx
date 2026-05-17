import React, { useEffect, useState } from "react";
import { CountdownText } from "./style";

const formatRemaining = (endsAt: string): string => {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = end - now;

  if (Number.isNaN(end)) return "";
  if (diff <= 0) return "Closed";

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `Closes in ${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `Closes in ${hours}h ${minutes}m`;
  if (minutes > 0) return `Closes in ${minutes}m ${secs}s`;
  return `Closes in ${secs}s`;
};

export const Countdown = ({ endsAt }: { endsAt: string }) => {
  const [label, setLabel] = useState(() => formatRemaining(endsAt));

  useEffect(() => {
    setLabel(formatRemaining(endsAt));
    const id = window.setInterval(() => {
      setLabel(formatRemaining(endsAt));
    }, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  return <CountdownText>{label}</CountdownText>;
};
