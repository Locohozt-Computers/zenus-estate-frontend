import React, { PropsWithChildren } from "react";
import styled from "styled-components/macro";
import { Sidebar } from "components";

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
  return (
    <DashboardStyling>
      <SideBarStyling>
        <Sidebar />
      </SideBarStyling>
      <ContentStyling>{children}</ContentStyling>
    </DashboardStyling>
  );
};

export const DashboardContent = ({ children }: PropsWithChildren) => {
  return <div className="dashboard-container">{children}</div>;
};
