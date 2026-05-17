import React, { useState } from "react";
import { Loader } from "components/atoms/Loader";
import { Card } from "components/atoms";
import { Typography } from "components";
import { DashboardContent } from "layouts";
import { formatNameToDisplay, getInitials } from "utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "store/reducers/auth/authDocSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "app-constants";
import {
  FiChevronRight,
  FiUser,
  FiShield,
  FiFileText,
  FiLogOut,
  FiTrash2,
  FiLock,
  FiSmartphone,
  FiGift,
  FiHelpCircle,
  FiUserPlus,
} from "react-icons/fi";
import house from "assets/images/img.png";
import { ChangePinModal } from "./ChangePinModal";
import {
  AccountPageStyle,
  ProfileHeader,
  AvatarCircle,
  ProfileActions,
  ActionBtn,
  Section,
  SectionTitle,
  MenuItem,
  MenuItemText,
  MenuItemIcon,
  Divider,
  VersionText,
  InfoRow,
} from "./style";

const MyAccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [changePinOpen, setChangePinOpen] = useState(false);

  const firstName = useSelector(authSelectors.firstName);
  const lastName = useSelector(authSelectors.lastName);
  const email = useSelector(authSelectors.email);
  const phoneNumber = useSelector(authSelectors.phoneNumber);

  const fullName = `${firstName} ${lastName}`.trim();
  const initials = getInitials(formatNameToDisplay(fullName));

  const handleLogout = () => {
    dispatch(authActions.logoutUser());
    navigate(ROUTES.login.fullPath);
  };

  return (
    <DashboardContent>
      <AccountPageStyle>
        <Loader open={false} absolute />
        <ChangePinModal
          visible={changePinOpen}
          onClose={() => setChangePinOpen(false)}
        />

        <Card className="account-card">
          {/* Profile Header */}
          <ProfileHeader style={{ backgroundImage: `url(${house})` }}>
            <AvatarCircle>
              <Typography size={34} textColor="white">
                {initials}
              </Typography>
            </AvatarCircle>
          </ProfileHeader>

          <div className="profile-info">
            <Typography variant="bodyBig" weight={700}>
              {firstName}
            </Typography>
            <Typography variant="bodyBig" weight={700}>
              {lastName}
            </Typography>
            <Typography textColor="gray" size={13}>
              {email || "--"}
            </Typography>
            <Typography textColor="gray" size={13}>
              {phoneNumber || "--"}
            </Typography>
          </div>

          <ProfileActions>
            <ActionBtn variant="outline">Edit Profile</ActionBtn>
            <ActionBtn variant="primary">Join ...</ActionBtn>
          </ProfileActions>

          {/* Account Information */}
          <Section>
            <SectionTitle>Account Information</SectionTitle>
            <InfoRow>
              <Typography textColor="gray" size={13}>
                Phone Number
              </Typography>
              <Typography size={13}>{phoneNumber || "--"}</Typography>
            </InfoRow>
            <Divider />
            <InfoRow>
              <Typography textColor="gray" size={13}>
                Email Address
              </Typography>
              <Typography size={13}>{email || "--"}</Typography>
            </InfoRow>
          </Section>

          {/* Configurations */}
          <Section>
            <SectionTitle>Configurations</SectionTitle>
            <MenuItem>
              <MenuItemIcon>
                <FiGift size={18} />
              </MenuItemIcon>
              <MenuItemText>Referrals</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemIcon>
                <FiUserPlus size={18} />
              </MenuItemIcon>
              <MenuItemText>Join Requests</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemIcon>
                <FiHelpCircle size={18} />
              </MenuItemIcon>
              <MenuItemText>Help Center</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
          </Section>

          {/* Security */}
          <Section>
            <SectionTitle>Security</SectionTitle>
            <MenuItem>
              <MenuItemIcon>
                <FiShield size={18} />
              </MenuItemIcon>
              <MenuItemText>Biometric Validation</MenuItemText>
              {/* toggle placeholder */}
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemIcon>
                <FiSmartphone size={18} />
              </MenuItemIcon>
              <MenuItemText>Linked Devices</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setChangePinOpen(true)}>
              <MenuItemIcon>
                <FiLock size={18} />
              </MenuItemIcon>
              <MenuItemText>Change PIN</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <MenuItemIcon style={{ color: "var(--error, #e74c3c)" }}>
                <FiLogOut size={18} />
              </MenuItemIcon>
              <MenuItemText style={{ color: "var(--error, #e74c3c)" }}>
                Log Out
              </MenuItemText>
              <FiChevronRight size={18} color="var(--error, #e74c3c)" />
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemIcon style={{ color: "var(--error, #e74c3c)" }}>
                <FiTrash2 size={18} />
              </MenuItemIcon>
              <MenuItemText style={{ color: "var(--error, #e74c3c)" }}>
                Delete Account
              </MenuItemText>
              <FiChevronRight size={18} color="var(--error, #e74c3c)" />
            </MenuItem>
          </Section>

          {/* Legal */}
          <Section>
            <SectionTitle>Legal</SectionTitle>
            <MenuItem>
              <MenuItemIcon>
                <FiFileText size={18} />
              </MenuItemIcon>
              <MenuItemText>Terms &amp; Conditions</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuItemIcon>
                <FiUser size={18} />
              </MenuItemIcon>
              <MenuItemText>Privacy Policy</MenuItemText>
              <FiChevronRight size={18} color="var(--gray)" />
            </MenuItem>
          </Section>

          <VersionText>Version: 9.9.22</VersionText>
        </Card>
      </AccountPageStyle>
    </DashboardContent>
  );
};

export default MyAccountPage;
