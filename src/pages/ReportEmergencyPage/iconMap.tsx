import React from "react";
import { IconType } from "react-icons";
import { GoPrimitiveDot } from "react-icons/go";
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiDroplet,
  FiEye,
  FiHome,
  FiPhone,
  FiRadio,
  FiShield,
  FiUserX,
  FiWind,
  FiZap,
} from "react-icons/fi";
import { FaAmbulance, FaFire, FaFireExtinguisher } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";
import { AppIcon } from "utils";

const map: Record<string, IconType> = {
  fire: FaFire,
  flame: FaFire,
  "fire-extinguisher": FaFireExtinguisher,
  medical: MdLocalHospital,
  ambulance: FaAmbulance,
  alert: FiAlertCircle,
  "alert-circle": FiAlertCircle,
  "alert-triangle": FiAlertTriangle,
  home: FiHome,
  "user-x": FiUserX,
  eye: FiEye,
  droplet: FiDroplet,
  wind: FiWind,
  shield: FiShield,
  radio: FiRadio,
  phone: FiPhone,
  zap: FiZap,
};

export const EmergencyIcon = ({
  icon,
  color,
  size = 28,
}: {
  icon?: string | null;
  color?: string;
  size?: number;
}) => {
  const Icon = (icon && map[icon]) || GoPrimitiveDot;
  return <AppIcon render={Icon} size={size} style={{ color }} />;
};
