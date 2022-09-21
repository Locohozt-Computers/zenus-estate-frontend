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
import { Link } from "react-router-dom";
import { IconGrayUser } from "assets/icons/";
import { AppIcon } from "utils/iconRender";
import { RiLogoutCircleFill } from "react-icons/ri";
import { authActions } from "store/reducers/auth/authDocSlice";
import { useDispatch } from "react-redux";
import { LogoutBtnActions } from "components/organisms/Sidebar/styles";

const HeaderStyles = styled.div`
  display: grid;
  //grid-template-columns: 1fr;
  grid-template-areas: "text text account" "search search search";
  grid-gap: 40px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 8px;

  @media screen and (min-width: ${pxToEm(1200, false)}) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "text search account";
    padding: 20px 40px;
  } ;
`;

const SearchStyle = styled.div<{ loading?: boolean }>`
  position: relative;
  max-width: 535px;

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
`;

const AccountDrop = styled.button`
  position: relative;
  all: unset;
  cursor: pointer;
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
  left: -106px;
  z-index: 1;
  background-color: white;
  overflow: hidden;

  > ul {
    box-shadow: 2px 5px 10px 1px #00000026;
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
          placeholder="Search Location..."
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

export const HomeHeader = () => {
  const { isLoading, data } = useQuery(["getUserProfile"], getUserProfile);
  const { ref, visible, setVisible } = useOnClickOutside(false);

  const [showLogout, setShowLogout] = useState(false);

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const [searching, setSearching] = useState(false);
  const makeSearch = useCallback(() => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
    }, 3000);
  }, []);

  const name = (data?.tenant_name || data?.landlord_name) as string;

  const logoutUser = () => {
    dispatch(authActions.logoutUser());
    queryClient.clear();
  };

  return (
    <>
      <Card style={{ marginBottom: 16, position: "relative" }}>
        <Loader absolute open={isLoading} />
        <HeaderStyles>
          <div style={{ gridArea: "text", maxWidth: 400 }}>
            <Typography variant="heading4" className="text-truncate_2">
              Welcome Back {name && `, ${formatNameToDisplay(name)}`}
            </Typography>
            <Typography variant="bodyBig">
              Keep your environment clean, stay safe. 😷
            </Typography>
          </div>
          <Search onSearch={makeSearch} loading={searching} />
          <AccountDiv>
            <NotificationDropdown />
            <div style={{ position: "relative" }}>
              <AccountDrop ref={ref} onClick={() => setVisible(!visible)}>
                <AiOutlineCaretDown size={20} color="var(--gray)" />
                {/* <img */}
                {/*  className="initials" */}
                {/*  src="https://picsum.photos/200/300" */}
                {/*  alt={name} */}
                {/* /> */}
                <div
                  className="initials"
                  aria-label={`name initial for ${name}`}
                >
                  <Typography color="white" weight={600} size={18}>
                    {getInitials(name)}
                  </Typography>
                </div>
                {visible && (
                  <Drop>
                    <UlStyle>
                      <li>
                        <Link
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                          to="/myAccount"
                        >
                          <IconGrayUser />
                          <Typography textColor="gray">My Account</Typography>
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <button
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "40px",
                          }}
                          type="button"
                          className="link"
                          onClick={logoutUser}
                        >
                          <AppIcon size={23} render={RiLogoutCircleFill} />
                          <Typography textColor="gray">Log Out</Typography>
                        </button>
                      </li>
                    </UlStyle>
                  </Drop>
                )}
              </AccountDrop>
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
