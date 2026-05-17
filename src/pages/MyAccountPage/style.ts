import styled from "styled-components/macro";
import { pxToEm } from "utils";

export const AccountPageStyle = styled.div`
  position: relative;

  .account-card {
    width: 100%;
    max-width: 480px;
    margin: auto;
    padding: 0 0 24px;
    overflow: hidden;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-top: 60px;
    padding: 0 20px;
    text-align: center;
  }

  .toggle-track {
    width: 40px;
    height: 22px;
    background-color: var(--blue);
    border-radius: 11px;
    position: relative;
    flex-shrink: 0;
  }

  .toggle-thumb {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    right: 3px;
  }
`;

export const ProfileHeader = styled.div`
  height: 160px;
  background-position: center;
  background-size: cover;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
`;

export const AvatarCircle = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: var(--blue);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
  position: absolute;
  bottom: -45px;
`;

export const ProfileActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 20px 0;
`;

export const ActionBtn = styled.button<{ variant: "outline" | "primary" }>`
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: ${({ variant }) =>
    variant === "outline" ? "1.5px solid var(--blue)" : "none"};
  background: ${({ variant }) =>
    variant === "primary" ? "var(--green, #a8e063)" : "transparent"};
  color: ${({ variant }) =>
    variant === "outline" ? "var(--blue)" : "#1a1a1a"};
`;

export const Section = styled.div`
  margin: 24px 16px 0;
  background: var(--lighter-gray, #f5f6fa);
  border-radius: 12px;
  overflow: hidden;
  padding: 0 16px;
`;

export const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 14px 0 8px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  color: var(--blue);
  flex-shrink: 0;
`;

export const MenuItemText = styled.span`
  flex: 1;
  font-size: 14px;
  color: #1a1a1a;
`;

export const Divider = styled.div`
  height: 1px;
  background: var(--gray-3, #e0e0e0);
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
`;

export const VersionText = styled.p`
  text-align: center;
  font-size: 12px;
  color: var(--gray);
  font-style: italic;
  margin-top: 24px;
`;

// Legacy exports kept for any remaining imports
export const MyAccountStyle = AccountPageStyle;
export const MyAccountHeader = ProfileHeader;
export const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${pxToEm(35)};
`;
export const DataFieldStyling = styled.div``;
export const AccountInnerInputStyling = styled.input``;
