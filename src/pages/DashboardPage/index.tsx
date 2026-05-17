import React, { useEffect, useRef, useState } from "react";
import { Typography } from "components/atoms";
import { useQuery } from "@tanstack/react-query";
import { getPropertyDashboard } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { useSelector } from "react-redux";
import { clientSelectors } from "store/reducers/client/clientSlice";
import styled from "styled-components/macro";
import { pxToEm, AppIcon } from "utils";
import { currencyFormat } from "utils/helpers";
import { format } from "date-fns";
import { DATE_FORMAT } from "app-constants";
import { TransactionTypeEnum } from "api";
import { DashboardLevyI, DashboardTransactionI } from "api/types";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import withdraw from "assets/images/withdrawcash.png";
import add from "assets/images/addcash.png";

/* ── Styled ── */

const PageWrapper = styled.div`
  padding: 20px 16px;
  max-width: 900px;

  @media screen and (min-width: ${pxToEm(900, false)}) {
    padding: 30px 40px;
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

/* ── Carousel ── */

const CarouselWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const CarouselTrack = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;

  /* hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LevyCard = styled.div<{ $active?: boolean; $negative?: boolean }>`
  scroll-snap-align: start;
  flex-shrink: 0;
  /* viewport-relative width so it always fits within the clipped content area */
  width: calc(100vw - 88px);
  max-width: 340px;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  border: 2px solid
    ${({ $active }) => ($active ? "var(--blue)" : "var(--gray-3)")};
  padding: 20px 18px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: border-color 0.15s ease;
  /* gap between cards via margin so snap positions stay correct */
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }

  @media screen and (min-width: ${pxToEm(600, false)}) {
    width: 260px;
    max-width: 260px;
  }
`;

const BalanceAmount = styled.div<{ $negative?: boolean }>`
  font-size: clamp(18px, 5vw, 26px);
  font-weight: 700;
  color: ${({ $negative }) => ($negative ? "var(--pink)" : "var(--blue)")};
  margin: 8px 0 4px;
  letter-spacing: -0.5px;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const HideBtn = styled.button`
  all: unset;
  cursor: pointer;
  color: var(--med-gray);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-bottom: 6px;

  &:hover {
    color: var(--blue);
  }
`;

const ArrowBtn = styled.button<{ $side: "left" | "right" }>`
  all: unset;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => ($side === "left" ? "left: -14px;" : "right: -14px;")}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1.5px solid var(--gray-3);
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;

  @media screen and (min-width: ${pxToEm(600, false)}) {
    display: flex;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }

  &:hover:not(:disabled) {
    border-color: var(--blue);
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 24px;
`;

const Dot = styled.button<{ $active?: boolean }>`
  all: unset;
  cursor: pointer;
  width: ${({ $active }) => ($active ? "20px" : "8px")};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "var(--blue)" : "var(--gray-3)")};
  transition: all 0.2s ease;
`;

/* ── Transactions ── */

const TransactionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0 12px;
  border-top: 1.5px solid var(--gray-3);
  margin-top: 8px;
`;

const TransactionList = styled.div`
  display: grid;
  gap: 10px;
`;

const TxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(182, 192, 211, 0.15);
  overflow: hidden;

  img {
    flex-shrink: 0;
  }
`;

const TxInfo = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const TxDescription = styled.div`
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--black);
`;

const TxMeta = styled.div`
  font-size: 11px;
  color: var(--med-gray);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TxAmount = styled.div<{ $credit?: boolean }>`
  font-size: clamp(12px, 3.5vw, 14px);
  font-weight: 700;
  color: ${({ $credit }) => ($credit ? "var(--green)" : "var(--pink)")};
  white-space: nowrap;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 0;
  color: var(--med-gray);
  font-size: 14px;
`;

/* ── Sub-components ── */

const TransactionRow = ({ tx }: { tx: DashboardTransactionI }) => {
  const isCredit = tx.transaction_type?.name === TransactionTypeEnum.Credit;
  const dateStr = (() => {
    try {
      return format(new Date(tx.created_at), DATE_FORMAT.shortMonth);
    } catch {
      return "";
    }
  })();
  return (
    <TxRow>
      <img
        src={isCredit ? add : withdraw}
        alt={tx.transaction_type?.name}
        style={{ width: 36, height: 36 }}
      />
      <TxInfo>
        <TxDescription>{tx.description}</TxDescription>
        <TxMeta>
          {dateStr} · {tx.transaction_status?.name}
        </TxMeta>
      </TxInfo>
      <TxAmount $credit={isCredit}>
        {isCredit ? "+" : "-"}
        {currencyFormat(Math.abs(tx.amount))}
      </TxAmount>
    </TxRow>
  );
};

/* ── Main component ── */

const DashboardPage = () => {
  const selectedProperty = useSelector(clientSelectors.selectedProperty);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery(
    [getPropertyDashboard.key],
    getPropertyDashboard
  );

  const properties = data?.properties ?? [];

  const activeProperty =
    properties.find((p) => p.customer_id === selectedProperty?.id) ??
    properties[0];

  const levies: DashboardLevyI[] = activeProperty?.levies ?? [];
  const activeLevyTransactions =
    levies[currentIndex]?.recent_transactions?.slice(0, 5) ?? [];

  /* reset carousel when property changes */
  useEffect(() => {
    setCurrentIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [selectedProperty?.id]);

  const scrollToIndex = (index: number) => {
    if (!trackRef.current || index < 0 || index >= levies.length) return;
    const cardWidth = trackRef.current.scrollWidth / levies.length;
    trackRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (!trackRef.current || levies.length === 0) return;
    const cardWidth = trackRef.current.scrollWidth / levies.length;
    const index = Math.round(trackRef.current.scrollLeft / cardWidth);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  return (
    <DashboardContent>
      <Loader absolute open={isLoading} />
      <PageWrapper>
        <SectionTitle>
          <Typography variant="heading5">Dashboard</Typography>
          <HideBtn onClick={() => setShowBalance(!showBalance)}>
            <AppIcon
              render={showBalance ? AiFillEyeInvisible : AiFillEye}
              size={16}
            />
            {showBalance ? "Hide" : "Show"} balances
          </HideBtn>
        </SectionTitle>

        {isError && (
          <EmptyState>
            Could not load dashboard data. Please try again later.
          </EmptyState>
        )}

        {!isLoading && !isError && levies.length === 0 && (
          <EmptyState>No levy data available for this property.</EmptyState>
        )}

        {levies.length > 0 && (
          <>
            <CarouselWrapper>
              <ArrowBtn
                $side="left"
                disabled={currentIndex === 0}
                onClick={() => scrollToIndex(currentIndex - 1)}
              >
                <AppIcon render={MdChevronLeft} size={20} color="var(--blue)" />
              </ArrowBtn>

              <CarouselTrack ref={trackRef} onScroll={handleScroll}>
                {levies.map((levy, i) => (
                  <LevyCard
                    key={levy.levy_id}
                    $active={i === currentIndex}
                    $negative={levy.balance < 0}
                    onClick={() => scrollToIndex(i)}
                  >
                    <Typography
                      size={12}
                      style={{
                        color: "var(--med-gray)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {levy.levy_name}
                    </Typography>
                    <BalanceAmount $negative={levy.balance < 0}>
                      {showBalance
                        ? currencyFormat(Math.abs(levy.balance))
                        : "••••••"}
                    </BalanceAmount>
                    <Typography size={11} style={{ color: "var(--med-gray)" }}>
                      {levy.balance < 0
                        ? "Outstanding balance"
                        : "No outstanding balance"}
                    </Typography>
                  </LevyCard>
                ))}
              </CarouselTrack>

              <ArrowBtn
                $side="right"
                disabled={currentIndex === levies.length - 1}
                onClick={() => scrollToIndex(currentIndex + 1)}
              >
                <AppIcon
                  render={MdChevronRight}
                  size={20}
                  color="var(--blue)"
                />
              </ArrowBtn>
            </CarouselWrapper>

            <Dots>
              {levies.map((levy, i) => (
                <Dot
                  key={levy.levy_id}
                  $active={i === currentIndex}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </Dots>

            <TransactionHeader>
              <Typography size={14} weight={600}>
                Recent Transactions
              </Typography>
              <Typography size={12} style={{ color: "var(--med-gray)" }}>
                {levies[currentIndex]?.levy_name}
              </Typography>
            </TransactionHeader>

            <TransactionList>
              {activeLevyTransactions.length === 0 ? (
                <EmptyState>No recent transactions for this levy.</EmptyState>
              ) : (
                activeLevyTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))
              )}
            </TransactionList>
          </>
        )}
      </PageWrapper>
    </DashboardContent>
  );
};

export default DashboardPage;
