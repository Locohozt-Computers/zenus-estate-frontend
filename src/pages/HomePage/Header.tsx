import styled from "styled-components/macro";
import {
  Button,
  Card,
  Modal,
  NotificationDropdown,
  Typography,
  UlStyle,
} from "components";
import { formatNameToDisplay, getInitials } from "utils/helpers";
import React, { ChangeEvent, useCallback, useState } from "react";
import { MdLocationPin } from "react-icons/md";
import { pxToEm } from "utils";
import { AiOutlineCaretDown } from "react-icons/ai";
import { useOnClickOutside } from "hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { IconSpinner } from "assets/icons";
import { useNavigate } from "react-router-dom";
import { IconGrayUser } from "assets/icons/";
import { AppIcon } from "utils/iconRender";
import { RiLogoutCircleFill } from "react-icons/ri";
import { authActions } from "store/reducers/auth/authDocSlice";
import { useDispatch } from "react-redux";
import { LogoutBtnActions } from "components/organisms/Sidebar/styles";
import { searchTenantsEmail } from "pages/HomePage/requests";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { ROUTES } from "app-constants";

const HeaderStyles = styled.div`
  display: grid;
  grid-template-areas: "account account account" "text text text" "search search search";
  grid-gap: 40px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 8px;

  @media screen and (min-width: ${pxToEm(900, false)}) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "text text account" "search search search";
    padding: 20px 40px;
  }

  @media screen and (min-width: ${pxToEm(1200, false)}) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "text search account";
    padding: 20px 40px;
  } ;
`;

const SearchStyle = styled.div<{ loading?: boolean }>`
  position: relative;
  max-width: 650px;
  min-width: 200px;

  > svg {
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    left: 25px;

    :last-child {
      right: 5px;
      left: unset;
      top: 0;
    }
  }

  > input {
    border-radius: 8px;
    border: 1px solid var(--gray-3);
    padding: 18px 20px 18px 50px;
    font-size: 16px;
    width: 100%;
    outline: none;
    padding-right: ${({ loading }) => loading && "47px"};

    &:hover {
      border: 1px solid var(--light-blue);
    }
    &:focus {
      border: 1px solid var(--blue);
    }
  }
`;

const AccountDiv = styled.div`
  position: relative;
  display: grid;
  grid-area: account;
  grid-auto-flow: column;
  gap: 30px;
  align-items: center;

  .account-container {
    position: relative;
    display: flex;
    justify-content: flex-end;
  }
`;

const AccountDrop = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .initials {
    border-radius: 22.5px;
    width: 45px;
    height: 45px;
    object-fit: cover;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--gray);
  }
`;

const Drop = styled.div`
  position: absolute;
  top: 65px;
  right: 0;
  background-color: white;
  overflow: hidden;
  z-index: 2;
  border-radius: 16px;
  box-shadow: 2px 5px 10px 1px #00000026;

  .dropDown-card {
    width: 100%;
    min-width: 181px;
    padding: 0;
    border-radius: 16px;
    box-shadow: 0 7px 62px -28px rgba(166, 166, 166, 0.35) !important;
  }

  .link {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--gray);
  }
`;

let timer: NodeJS.Timeout;

const Search = React.memo(
  ({
    onSearch,
    loading,
  }: {
    onSearch: (val: string) => void;
    loading?: boolean;
  }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (onSearch && e.target.value) onSearch(e.target.value.trim());
      }, 1000);
    };

    return (
      <SearchStyle loading={loading} style={{ gridArea: "search" }}>
        <MdLocationPin size={20} color="var(--blue)" />
        <input
          onChange={handleChange}
          type="search"
          placeholder="Search Email, Name, Block..."
        />
        {loading && (
          <IconSpinner
            style={{
              fontSize: 45,
            }}
          />
        )}
      </SearchStyle>
    );
  }
);

const TenantResults = styled.div`
  display: flex;
  align-items: center;
  overflow: auto;
  gap: 20px;

  .result-card {
    padding: clamp(10px, 10%, 30px);
    border-radius: 8px;
    background: url(${""});
    background-color: #f5f8ff;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .center-contents {
      gap: 10px;
    }
  }
`;

export const HomeHeader = () => {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery([getUserProfile.key], getUserProfile);

  const { ref, visible, setVisible } = useOnClickOutside(false);

  const [showLogout, setShowLogout] = useState(false);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const [searching, setSearching] = useState<string | boolean>(false);

  const { isFetching: isSearching, data: searchResponse } = useQuery(
    [searchTenantsEmail.key, searching],
    () => searchTenantsEmail({ search_block_name: searching as string }),
    {
      enabled: !!searching,
    }
  );

  const makeSearch = useCallback((value: string) => {
    setSearching(value);
  }, []);

  const name = (data?.tenant_name || data?.landlord_name) as string;

  const logoutUser = () => {
    dispatch(authActions.logoutUser());
    queryClient.clear();
  };

  const handleAccountActions = (e: React.MouseEvent<any>) => {
    const id = (e.target as Record<string, any>)?.id;
    if (id === "account") navigate(ROUTES.myAccount.fullPath);
    if (id === "log-out") setShowLogout(true);
  };

  return (
    <>
      <Modal
        visible={!!searchResponse?.data?.length}
        showCloseBtn={false}
        maxWidth={608}
        closeModal={() => setSearching(false)}
      >
        <Card style={{ padding: 25, display: "grid", gap: 20 }}>
          <div className="center-contents">
            <Typography.Heading
              variant="heading3"
              content={`${searchResponse?.total} Estate member found!`}
            />
          </div>
          <TenantResults>
            {searchResponse?.data?.map((el, i) => (
              <Card className="result-card" key={`${el.id}-${i.toString()}`}>
                <Typography
                  variant="bodyBig"
                  textColor="blue"
                  style={{ whiteSpace: "nowrap" }}
                  content={el.tenant_name}
                />
                <div className="center-contents justify-flex-start">
                  <AppIcon textColor="blue" render={HiOutlineMail} size={20} />
                  <Typography size={14}>
                    <a href={`mailto:${el.signup_email}`}>{el.signup_email}</a>
                  </Typography>
                </div>
                <div className="center-contents justify-flex-start">
                  <AppIcon textColor="blue" render={FiPhoneCall} size={20} />
                  <Typography size={14}>
                    <a href={`tel:${el.tenant_phone}`}>{el.tenant_phone}</a>
                  </Typography>
                </div>
              </Card>
            ))}
          </TenantResults>
          <div className="center-contents">
            <Button text="back" onClick={() => setSearching(false)} />
          </div>
        </Card>
      </Modal>
      <Card style={{ marginBottom: 16, position: "relative" }}>
        <Loader absolute open={isLoading} />
        <HeaderStyles>
          <div style={{ gridArea: "text" }}>
            <Typography variant="heading4" className="text-truncate_2">
              Welcome Back {name && `, ${formatNameToDisplay(name)}`}
            </Typography>
            <Typography variant="bodyBig">
              Keep your environment clean, stay safe. 😷
            </Typography>
          </div>
          <Search onSearch={makeSearch} loading={isSearching} />
          <AccountDiv>
            <NotificationDropdown />
            <div
              role="presentation"
              className="account-container"
              ref={ref}
              onClick={() => setVisible(!visible)}
            >
              <AccountDrop>
                <AppIcon
                  render={AiOutlineCaretDown}
                  size={20}
                  color="var(--gray)"
                />
                <div
                  className="initials"
                  aria-label={`name initial for ${name}`}
                >
                  <Typography color="white" weight={600} size={18}>
                    {getInitials(name)}
                  </Typography>
                </div>
              </AccountDrop>
              {visible && (
                <Drop>
                  <UlStyle onClick={handleAccountActions}>
                    <li className="link" id="account">
                      <AppIcon
                        id="account"
                        render={IconGrayUser}
                        color="inherit"
                        size={20}
                      />
                      <Typography id="account">My Account</Typography>
                    </li>
                    <li className="link" id="log-out">
                      <AppIcon
                        id="log-out"
                        color="inherit"
                        size={20}
                        render={RiLogoutCircleFill}
                      />
                      <Typography id="log-out">Log Out</Typography>
                    </li>
                  </UlStyle>
                </Drop>
              )}
            </div>
          </AccountDiv>
        </HeaderStyles>
      </Card>
      <Modal visible={showLogout} maxWidth={620} showCloseBtn={false}>
        <Card style={{ padding: "50px 70px" }}>
          <Typography
            variant="heading4"
            content="Are you sure you want to log out?"
            style={{ textAlign: "center" }}
          />
          <LogoutBtnActions>
            <Button
              secondary
              text="Cancel"
              onClick={() => setShowLogout(false)}
            />
            <Button text="Logout" onClick={logoutUser} />
          </LogoutBtnActions>
        </Card>
      </Modal>
    </>
  );
};
