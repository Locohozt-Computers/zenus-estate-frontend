import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { css } from "styled-components/macro";
import { Typography } from "components/atoms";
import {
  clientActions,
  clientSelectors,
} from "store/reducers/client/clientSlice";
import { PropertyI } from "api/types";
import { MdHome, MdExpandMore } from "react-icons/md";
import { AppIcon } from "utils";

const Wrapper = styled.div`
  position: relative;
  margin: 0 12px 8px;
`;

const Pill = styled.button`
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #f0f4ff;
  border: 1.5px solid #d6e3ff;
  transition: all 0.15s ease;
  box-sizing: border-box;

  &:hover {
    background: #e0ebff;
    border-color: var(--blue);
  }

  .pill-text {
    flex: 1;
    min-width: 0;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5eaf2;
  overflow: hidden;
  z-index: 50;
`;

const PropertyItem = styled.button<{ $active: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  transition: background 0.12s ease;
  box-sizing: border-box;

  ${({ $active }) =>
    $active
      ? css`
          background: #ebf2ff;
        `
      : css`
          &:hover {
            background: #f5f8ff;
          }
        `}

  & + & {
    border-top: 1px solid #f0f4ff;
  }

  .prop-info {
    flex: 1;
    min-width: 0;
  }
`;

const StatusBadge = styled.span<{ $occupied: boolean }>`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ $occupied }) => ($occupied ? "#e6f9ef" : "#fff4e5")};
  color: ${({ $occupied }) => ($occupied ? "#1a7a45" : "#b45309")};
  white-space: nowrap;
  flex-shrink: 0;
`;

const IconDot = styled.div<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "#e5eaf2")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PropertySwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const properties = useSelector(clientSelectors.properties);
  const selectedProperty = useSelector(clientSelectors.selectedProperty);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!selectedProperty) return null;

  const handleSelect = (property: PropertyI) => {
    dispatch(clientActions.selectProperty(property));
    setOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Pill onClick={() => setOpen(!open)}>
        <AppIcon render={MdHome} size={18} color="var(--blue)" />
        <div className="pill-text">
          <Typography
            size={11}
            style={{
              color: "var(--med-gray)",
              display: "block",
              lineHeight: 1,
            }}
          >
            Current Property
          </Typography>
          <Typography
            size={13}
            weight={600}
            style={{
              color: "var(--blue)",
              display: "block",
              lineHeight: 1.4,
            }}
          >
            House {selectedProperty.house_no}
          </Typography>
        </div>
        <AppIcon
          render={MdExpandMore}
          size={18}
          color="var(--blue)"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
          className="chevron"
        />
      </Pill>

      {open && properties.length > 1 && (
        <Dropdown>
          {properties.map((property) => {
            const isActive = selectedProperty.id === property.id;
            const isOccupied = property.house_status.id === 1;
            return (
              <PropertyItem
                key={property.id}
                $active={isActive}
                onClick={() => handleSelect(property)}
              >
                <IconDot $active={isActive}>
                  <AppIcon
                    render={MdHome}
                    size={15}
                    color={isActive ? "white" : "var(--med-gray)"}
                  />
                </IconDot>
                <div className="prop-info">
                  <Typography
                    size={13}
                    weight={isActive ? 600 : 400}
                    style={{
                      display: "block",
                      color: isActive ? "var(--blue)" : "inherit",
                    }}
                  >
                    House {property.house_no}
                  </Typography>
                  <Typography
                    size={11}
                    style={{ color: "var(--med-gray)", display: "block" }}
                  >
                    {property.relationship_type}
                  </Typography>
                </div>
                <StatusBadge $occupied={isOccupied}>
                  {property.house_status.name}
                </StatusBadge>
              </PropertyItem>
            );
          })}
        </Dropdown>
      )}
    </Wrapper>
  );
};
