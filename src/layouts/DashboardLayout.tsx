import React, { PropsWithChildren, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Sidebar } from "components";
import { useSelector } from "react-redux";
import { authSelectors } from "store/reducers/auth/authDocSlice";
import { setAuthorizationHeader } from "api";
import { Loader } from "components/atoms/Loader";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";

const DashboardStyling = styled.div<{ sidebar?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;

  .dashboard-container {
    width: 100%;
    max-width: 1120px;
  }

  @media screen and (min-width: 900px) {
    grid-template-columns: minmax(auto, 282px) 1fr;
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
  width: ${({ sidebar }) => (sidebar ? "282px" : "72px")};

  @media screen and (min-width: 900px) {
    width: 282px;
  }
`;

const FloatingToggle = styled.button`
  position: absolute;
  bottom: 20px;
  right: 30px;
  border: none;
  background-color: var(--blue);
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  cursor: pointer;

  @media screen and (min-width: 900px) {
    display: none;
  }
`;

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiToken = useSelector(authSelectors.token);

  useEffect(() => {
    // persist token in app
    if (apiToken) {
      setAuthorizationHeader(apiToken);
      setLoading(false);
    }
  }, [apiToken]);

  return (
    <DashboardStyling sidebar={sidebarCollapse}>
      <SideBarStyling sidebar={sidebarCollapse}>
        <Sidebar open={sidebarCollapse} />
      </SideBarStyling>
      <ContentStyling>
        <Loader open={loading} />
        {loading ? null : children}
      </ContentStyling>
      <FloatingToggle onClick={() => setSidebarCollapse(!sidebarCollapse)}>
        {!sidebarCollapse ? (
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
