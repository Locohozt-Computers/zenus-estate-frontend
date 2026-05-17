import React from "react";
import { IconType } from "react-icons";
import { GoPrimitiveDot } from "react-icons/go";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiDroplet,
  FiHome,
  FiMessageCircle,
  FiPaperclip,
  FiPlusCircle,
  FiRefreshCw,
  FiRotateCcw,
  FiTool,
  FiTrash2,
  FiUser,
  FiVolumeX,
  FiWifi,
  FiZap,
} from "react-icons/fi";
import { FaFire, FaFlag } from "react-icons/fa";
import { MdSecurity, MdSpeed } from "react-icons/md";
import { AppIcon } from "utils";
import { SupportTicketActivityType } from "api";

const issueIconMap: Record<string, IconType> = {
  fire: FaFire,
  flame: FaFire,
  beaker: FiDroplet,
  droplet: FiDroplet,
  water: FiDroplet,
  wallet: FiCreditCard,
  card: FiCreditCard,
  meter: MdSpeed,
  electricity: FiZap,
  zap: FiZap,
  wrench: FiTool,
  tool: FiTool,
  home: FiHome,
  noise: FiVolumeX,
  security: MdSecurity,
  shield: MdSecurity,
  wifi: FiWifi,
  trash: FiTrash2,
  alert: FiAlertCircle,
  "alert-circle": FiAlertCircle,
  "alert-triangle": FiAlertTriangle,
};

export const IssueTypeIcon = ({
  icon,
  color,
  size = 24,
}: {
  icon?: string | null;
  color?: string | null;
  size?: number;
}) => {
  const Icon = (icon && issueIconMap[icon]) || GoPrimitiveDot;
  return (
    <AppIcon
      render={Icon}
      size={size}
      style={{ color: color || "var(--blue)" }}
    />
  );
};

const activityIconMap: Partial<Record<SupportTicketActivityType, IconType>> = {
  created: FiPlusCircle,
  commented: FiMessageCircle,
  status_changed: FiRefreshCw,
  priority_changed: FaFlag,
  assigned: FiUser,
  unassigned: FiUser,
  resolved: FiCheckCircle,
  reopened: FiRotateCcw,
  attachment_added: FiPaperclip,
};

export const ActivityIcon = ({
  type,
  size = 16,
}: {
  type?: SupportTicketActivityType;
  size?: number;
}) => {
  const Icon = (type && activityIconMap[type]) || FiAlertCircle;
  return <AppIcon render={Icon} size={size} />;
};
