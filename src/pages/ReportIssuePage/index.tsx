import React, { useState } from "react";
import { Typography } from "components/atoms";
import { DashboardContent } from "layouts";
import { RaiseTicketTab } from "./RaiseTicketTab";
import { MyTicketsTab } from "./MyTicketsTab";
import { PageCard, TabBar, TabBtn, Wrapper } from "./style";

type Tab = "raise" | "list";

const ReportIssuePage = () => {
  const [tab, setTab] = useState<Tab>("raise");

  return (
    <DashboardContent>
      <Wrapper>
        <PageCard>
          <Typography variant="heading4" style={{ marginBottom: 16 }}>
            Report Issue
          </Typography>
          <TabBar role="tablist">
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "raise"}
              active={tab === "raise"}
              onClick={() => setTab("raise")}
            >
              Raise Ticket
            </TabBtn>
            <TabBtn
              type="button"
              role="tab"
              aria-selected={tab === "list"}
              active={tab === "list"}
              onClick={() => setTab("list")}
            >
              My Tickets
            </TabBtn>
          </TabBar>

          {tab === "raise" ? <RaiseTicketTab /> : <MyTicketsTab />}
        </PageCard>
      </Wrapper>
    </DashboardContent>
  );
};

export default ReportIssuePage;
