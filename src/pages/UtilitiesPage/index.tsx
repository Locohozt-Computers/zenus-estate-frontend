import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardContent } from "layouts";
import { getSalesItems } from "pages/request";
import { pxToEm } from "utils";
import { MdArrowBack } from "react-icons/md";
import { ROUTES } from "app-constants";
import { useAppSelector } from "store";
import { clientSelectors } from "store/reducers/client/clientSlice";
import { useElectricitySettings } from "hooks/useElectricitySettings";
import { notification } from "services";

const POWER_TOKEN_SALES_ITEM_ID = "1";

const PageWrapper = styled.div`
  padding: 24px 0;
`;

const BackButton = styled.button`
  all: unset;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--blue);
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;

  &:hover {
    opacity: 0.75;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.2rem, 4vw, 1.6rem);
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 8px;
  font-family: "Montserrat", sans-serif;
`;

const UtilitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;

  @media screen and (min-width: ${pxToEm(700, false)}) {
    gap: 24px;
  }
`;

const UtilityCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const UtilityIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const UtilityName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  font-family: "Montserrat", sans-serif;
`;

const LoadingMessage = styled.p`
  font-size: 1rem;
  color: #666;
  font-family: "Montserrat", sans-serif;
  text-align: center;
  margin-top: 40px;
`;

const ErrorMessage = styled(LoadingMessage)`
  color: #d32f2f;
`;

const UtilitiesPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery(
    [getSalesItems.key],
    getSalesItems
  );

  const selectedProperty = useAppSelector(clientSelectors.selectedProperty);
  const { quotaEnabled } = useElectricitySettings();

  const utilities = data ? Object.entries(data) : [];

  const handleUtilityClick = (id: string) => {
    if (id !== POWER_TOKEN_SALES_ITEM_ID) {
      return;
    }
    const meterId = selectedProperty?.meters?.[0]?.id;
    if (!meterId) {
      notification.error(
        "No meter is linked to the selected property. Please contact your facility manager."
      );
      return;
    }
    navigate(
      quotaEnabled
        ? ROUTES.powerTokenQuota.fullPath
        : ROUTES.powerTokenBuy.fullPath
    );
  };

  return (
    <DashboardContent>
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
          Back
        </BackButton>
        <Title>Select Utility</Title>
        <>
          {isLoading && <LoadingMessage>Loading utilities...</LoadingMessage>}
          {error && (
            <ErrorMessage>
              Failed to load utilities. Please try again.
            </ErrorMessage>
          )}
          {!isLoading && !error && utilities.length === 0 && (
            <LoadingMessage>No utilities available.</LoadingMessage>
          )}
          {!isLoading && !error && utilities.length > 0 && (
            <UtilitiesList>
              {utilities.map(([id, name]) => (
                <UtilityCard key={id} onClick={() => handleUtilityClick(id)}>
                  <UtilityIcon>💡</UtilityIcon>
                  <UtilityName>{name}</UtilityName>
                </UtilityCard>
              ))}
            </UtilitiesList>
          )}
        </>
      </PageWrapper>
    </DashboardContent>
  );
};

export default UtilitiesPage;
