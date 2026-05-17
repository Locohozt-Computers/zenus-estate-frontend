import React from "react";
import { Card } from "components";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDashboard, getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { HomeHeader } from "pages/HomePage/Header";
import { currencyFormat } from "utils/helpers";
import styled from "styled-components/macro";
import { pxToEm, AppIcon } from "utils";
import { useSelector } from "react-redux";
import { clientSelectors } from "store/reducers/client/clientSlice";
import { Typography } from "components/atoms";
import { HiOfficeBuilding } from "react-icons/hi";
import { PaymentHistory } from "./PaymentHistory";
import { BalanceCard } from "./BalanceCard";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { QuickActions } from "./QuickActions";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardStyling = styled(Card)`
  padding: 0;
`;

const Wrapper = styled.div`
  padding: 10px 8px;

  @media screen and (min-width: ${pxToEm(1200, false)}) {
    padding: 20px 40px;
  }
`;

const AccountList = styled.div`
  display: flex;
  gap: 20px;
  overflow: auto;
  margin-bottom: 10px;
  padding: 20px 5px;
`;

const NoCommunityCard = styled.div`
  background: #f5f8ff;
  border: 1.5px dashed #d6e3ff;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HomePage = () => {
  const queryClient = useQueryClient();
  const estates = useSelector(clientSelectors.estates);

  const { isLoading: isDashboardLoading, data } = useQuery(
    [getDashboard.key],
    getDashboard
  );

  const { isLoading: isProfileLoading, data: profile } = useQuery(
    [getUserProfile.key],
    getUserProfile
  );

  const isLoading = isDashboardLoading || isProfileLoading;

  const selectedProperty = useSelector(clientSelectors.selectedProperty);

  const activeProperty =
    data?.properties?.find((p) => p.customer_id === selectedProperty?.id) ??
    data?.properties?.[0];

  const levies = activeProperty?.levies ?? [];

  const handleRefresh = () => {
    queryClient.invalidateQueries([getUserProfile.key]).catch(() => null);
  };

  return (
    <>
      <HomeHeader />
      <DashboardContent>
        <Loader absolute open={isLoading} />
        <PageWrapper>
          <WalletBalanceCard
            balance={parseFloat(profile?.walletBalance ?? "0")}
            onRefresh={handleRefresh}
            isRefreshing={isProfileLoading}
          />

          <QuickActions />

          {estates.length === 0 && (
            <NoCommunityCard>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <AppIcon
                  render={HiOfficeBuilding}
                  size={28}
                  color="var(--blue)"
                />
                <Typography variant="heading3" size={18}>
                  Request To Join A Community
                </Typography>
              </div>
              <Typography style={{ color: "var(--med-gray)" }}>
                Your account has not been assigned to any community yet. Please
                contact your administrator to get access.
              </Typography>
            </NoCommunityCard>
          )}

          {estates.length > 0 && (
            <CardStyling>
              <Wrapper>
                <AccountList>
                  {levies.map((levy) => (
                    <BalanceCard
                      key={levy.levy_id}
                      name={levy.levy_name}
                      amount={currencyFormat(Math.abs(levy.balance))}
                    />
                  ))}
                </AccountList>
              </Wrapper>
              <div>
                <PaymentHistory levies={levies} />
              </div>
            </CardStyling>
          )}
        </PageWrapper>
      </DashboardContent>
    </>
  );
};

export default HomePage;
