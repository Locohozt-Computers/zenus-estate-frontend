import React, { PropsWithChildren, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Sidebar } from "components";
import { useSelector } from "react-redux";
import { authSelectors } from "store/reducers/auth/authDocSlice";
import { getAuthorizationToken, setAuthorizationHeader } from "api";
import { Loader } from "components/atoms/Loader";

const DashboardStyling = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 282px) 1fr;
  height: 100vh;

  .dashboard-container {
    width: 100%;
    max-width: 1120px;
  }
`;

const ContentStyling = styled.main`
  position: relative;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--lighter-gray);
`;

const SideBarStyling = styled.div`
  background-color: white;
`;

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const apiToken = useSelector(authSelectors.token);

  useEffect(() => {
    if (apiToken && !getAuthorizationToken()) {
      setAuthorizationHeader(apiToken);
      setLoading(false);
    }
  }, [apiToken]);

  return (
    <DashboardStyling>
      <SideBarStyling>
        <Sidebar />
      </SideBarStyling>
      {loading ? null : (
        <ContentStyling>
          <Loader open={loading} />
          {children}
        </ContentStyling>
      )}
    </DashboardStyling>
  );
};

export const DashboardContent = ({ children }: PropsWithChildren) => {
  return <div className="dashboard-container">{children}</div>;
};
