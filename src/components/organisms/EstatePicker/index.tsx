import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components/macro";
import { Typography } from "components/atoms";
import {
  clientActions,
  clientSelectors,
} from "store/reducers/client/clientSlice";
import { EstateI } from "api/types";
import { getProperties } from "pages/request";
import { HiOfficeBuilding } from "react-icons/hi";
import { AppIcon } from "utils";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease;
`;

const PickerCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: ${slideUp} 0.25s ease;
`;

const EstateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 32px;
`;

const EstateCard = styled.button<{ $selected: boolean; $loading: boolean }>`
  all: unset;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  padding: 24px 20px;
  border-radius: 14px;
  border: 2px solid
    ${({ $selected }) => ($selected ? "var(--blue)" : "#e5eaf2")};
  background-color: ${({ $selected }) => ($selected ? "#ebf2ff" : "#fafbff")};
  transition: all 0.18s ease;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${({ $loading }) => ($loading ? 0.6 : 1)};

  &:hover:not(:disabled) {
    border-color: var(--blue);
    background-color: #ebf2ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 48, 133, 0.12);
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${({ $selected }) =>
      $selected ? "var(--blue)" : "var(--gray-2)"};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s ease;
  }

  &:hover:not(:disabled) .icon-wrap {
    background: var(--blue);
  }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #e5eaf2;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 32px auto 0;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const EstatePicker: React.FC = () => {
  const dispatch = useDispatch();
  const estates = useSelector(clientSelectors.estates);
  const showEstatePicker = useSelector(clientSelectors.showEstatePicker);
  const selectedEstate = useSelector(clientSelectors.selectedEstate);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (!showEstatePicker) return null;

  const handleSelect = async (estate: EstateI) => {
    if (loadingId) return;
    setLoadingId(estate.id);
    dispatch(clientActions.selectEstate(estate));
    try {
      const properties = await getProperties();
      dispatch(clientActions.setProperties(properties));
      if (properties.length) {
        dispatch(clientActions.selectProperty(properties[0]));
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Overlay>
      <PickerCard>
        <div style={{ textAlign: "center" }}>
          <Typography variant="heading3">Switch Your Community</Typography>
          <Typography style={{ color: "var(--med-gray)", marginTop: 8 }}>
            Choose the community you want to have access to
          </Typography>
        </div>

        {estates.length === 0 ? (
          <div
            style={{
              marginTop: 40,
              textAlign: "center",
              padding: "32px 20px",
              borderRadius: 14,
              background: "#f5f8ff",
              border: "1.5px dashed #d6e3ff",
            }}
          >
            <AppIcon
              render={HiOfficeBuilding}
              size={40}
              color="#c0d0f0"
              style={{ marginBottom: 12 }}
            />
            <Typography weight={600} size={15} style={{ display: "block" }}>
              No community setup
            </Typography>
            <Typography
              size={13}
              style={{
                color: "var(--med-gray)",
                marginTop: 6,
                display: "block",
              }}
            >
              You have not been assigned to any community yet. Please contact
              your administrator.
            </Typography>
          </div>
        ) : (
          <EstateGrid>
            {estates.map((estate) => {
              const isSelected = selectedEstate?.id === estate.id;
              const isLoading = loadingId === estate.id;
              return (
                <EstateCard
                  key={estate.id}
                  $selected={isSelected}
                  $loading={!!loadingId}
                  onClick={() => {
                    handleSelect(estate).catch(() => null);
                  }}
                >
                  <div className="icon-wrap">
                    <AppIcon
                      render={HiOfficeBuilding}
                      size={20}
                      color="white"
                    />
                  </div>
                  <div>
                    <Typography
                      weight={600}
                      size={15}
                      style={{ display: "block" }}
                    >
                      {estate.name}
                    </Typography>
                    <Typography size={12} style={{ color: "var(--med-gray)" }}>
                      {estate.domain}
                    </Typography>
                  </div>
                  {isLoading && <Spinner />}
                </EstateCard>
              );
            })}
          </EstateGrid>
        )}
      </PickerCard>
    </Overlay>
  );
};
