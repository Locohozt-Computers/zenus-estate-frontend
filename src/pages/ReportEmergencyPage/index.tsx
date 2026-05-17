import React, { useState } from "react";
import { Typography } from "components/atoms";
import { DashboardContent } from "layouts";
import { ReportEmergencyTab } from "./ReportEmergencyTab";
import { MyEmergenciesTab } from "./MyEmergenciesTab";
import { DivContent, TabBar, TabBtn, Wrapper } from "./style";

type Tab = "report" | "my";

const ReportEmergencyPage = () => {
  const [tab, setTab] = useState<Tab>("report");

  return (
    <DashboardContent>
      <Wrapper>
        <DivContent>
          <Typography variant="heading4" style={{ marginBottom: 16 }}>
            Emergency
          </Typography>
          <TabBar role="tablist">
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "report"}
              active={tab === "report"}
              onClick={() => setTab("report")}
            >
              Report Emergency
            </TabBtn>
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "my"}
              active={tab === "my"}
              onClick={() => setTab("my")}
            >
              My Emergencies
            </TabBtn>
          </TabBar>

          {tab === "report" ? (
            <ReportEmergencyTab onViewMyEmergencies={() => setTab("my")} />
          ) : (
            <MyEmergenciesTab onSwitchToReport={() => setTab("report")} />
          )}
        </DivContent>
      </Wrapper>
    </DashboardContent>
  );
};

export default ReportEmergencyPage;
