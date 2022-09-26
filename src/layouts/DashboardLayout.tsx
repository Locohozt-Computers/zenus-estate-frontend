import React, { PropsWithChildren, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Sidebar } from "components";
import { useSelector } from "react-redux";
import { authSelectors } from "store/reducers/auth/authDocSlice";
import { setAuthorizationHeader } from "api";
import { Loader } from "components/atoms/Loader";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useLocation } from "react-router-dom";

const DashboardStyling = styled.div<{ sidebar?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  height: 100vh;

  .dashboard-container {
    position: relative;
    width: 100%;
    max-width: 1120px;
  }

  @media screen and (min-width: 1300px) {
    grid-template-columns: auto 1fr;
  }
`;

const ContentStyling = styled.main`
  position: relative;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--lighter-gray);
`;

const SideBarStyling = styled.div<{ sidebar: boolean }>`
  transition: 0.5s all;
  background-color: white;

  position: absolute;
  height: 100vh;
  width: 100%;
  max-width: 282px;
  z-index: 1;

  transform: translateX(${({ sidebar }) => (sidebar ? "-282px" : "0")});

  box-shadow: 3px -1px 19px 2px #0000003d;

  @media screen and (min-width: 1300px) {
    position: relative;
    transform: translateX(0px);
    box-shadow: none;
  }
`;

const FloatingToggle = styled.button`
  position: fixed;
  bottom: 15px;
  right: 15px;
  border: none;
  background-color: var(--blue);
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  cursor: pointer;
  box-shadow: 0 0 6px 4px #0000002b;

  @media screen and (min-width: 1300px) {
    display: none;
  }
`;

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const apiToken = useSelector(authSelectors.token);
  const location = useLocation();

  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [loading, setLoading] = useState(true);
  const [, setLastLoc] = useState("");

  useEffect(() => {
    // persist token in app
    if (apiToken) {
      setAuthorizationHeader(apiToken);
      setLoading(false);
    }
  }, [apiToken]);

  useEffect(() => {
    // handles auto close sidebar after click
    setLastLoc((prev) => {
      if (prev !== location.pathname) {
        if (prev) setSidebarCollapse(true);
        return location.pathname;
      }
      return prev;
    });
  }, [location]);

  return (
    <DashboardStyling sidebar={sidebarCollapse}>
      <SideBarStyling sidebar={sidebarCollapse}>
        <Sidebar open />
      </SideBarStyling>
      <ContentStyling>
        <Loader open={loading} />
        {loading ? null : children}
      </ContentStyling>
      <FloatingToggle onClick={() => setSidebarCollapse(!sidebarCollapse)}>
        {sidebarCollapse ? (
          <GiHamburgerMenu color="white" size={20} />
        ) : (
          <IoMdClose color="white" size={20} />
        )}
      </FloatingToggle>
    </DashboardStyling>
  );
};

export const DashboardContent = ({ children }: PropsWithChildren) => {
  return <div className="dashboard-container">{children}</div>;
};
