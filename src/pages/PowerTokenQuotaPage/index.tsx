import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

import { DashboardContent } from "layouts";

import {
  BackButton,
  PageWrapper,
  Subtitle,
  TabBar,
  TabBtn,
  Title,
} from "./style";
import { QuotaTab } from "./QuotaTab";
import { PurchasesTab } from "./PurchasesTab";

type Tab = "quota" | "purchases";

const PowerTokenQuotaPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("quota");

  return (
    <DashboardContent>
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
          Back
        </BackButton>
        <Title>Power Token</Title>
        <Subtitle>
          Review your electricity quota and purchase history for this property.
        </Subtitle>

        <TabBar role="tablist">
          <TabBtn
            type="button"
            role="tab"
            aria-selected={tab === "quota"}
            active={tab === "quota"}
            onClick={() => setTab("quota")}
          >
            Quota Usage
          </TabBtn>
          <TabBtn
            type="button"
            role="tab"
            aria-selected={tab === "purchases"}
            active={tab === "purchases"}
            onClick={() => setTab("purchases")}
          >
            Purchase History
          </TabBtn>
        </TabBar>

        {tab === "quota" ? <QuotaTab /> : <PurchasesTab />}
      </PageWrapper>
    </DashboardContent>
  );
};

export default PowerTokenQuotaPage;
