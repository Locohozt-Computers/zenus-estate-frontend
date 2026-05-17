import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Button, Card } from "components";
import { CopyableToken } from "components/atoms/CopyableToken";
import { ROUTES } from "app-constants";
import appRequest, { GetVerifyElectricityPayment } from "api";
import { currencyFormat } from "utils/helpers";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

type State = "loading" | "success" | "paid-pending-token" | "failed";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f8ff;
  padding: 20px;
`;

const ContentCard = styled(Card)`
  max-width: 480px;
  width: 100%;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
`;

const IconCircle = styled.div<{ $color: string }>`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
`;

const SpinnerRing = styled.div`
  width: 80px;
  height: 80px;
  border: 6px solid #e0e7ff;
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RetryText = styled.p`
  font-size: 13px;
  color: var(--med-gray);
  margin: 0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-family: "Montserrat", sans-serif;
  font-size: 0.85rem;

  &:last-of-type {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #888;
`;

const DetailValue = styled.span`
  font-weight: 600;
  color: #1a1a2e;
  word-break: break-all;
  text-align: right;
  margin-left: 12px;
`;

const ElectricityPaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tenantId = searchParams.get("tenant_id") ?? "";
  const reference = searchParams.get("reference") ?? "";

  const [pageState, setPageState] = useState<State>("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [paymentData, setPaymentData] = useState<
    typeof GetVerifyElectricityPayment.Res["data"] | null
  >(null);

  const retriesRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verify = useCallback(async () => {
    if (!reference || !tenantId) {
      setPageState("failed");
      return;
    }

    try {
      const res = await appRequest.get<typeof GetVerifyElectricityPayment.Res>(
        GetVerifyElectricityPayment.Route,
        { params: { reference, tenant_id: tenantId } }
      );

      if (res.data?.data?.is_successful) {
        setPaymentData(res.data.data);
        setPageState("success");
        return;
      }

      if (res.data?.data?.payment_status === "paid_pending_token") {
        setPaymentData(res.data.data);
        setPageState("paid-pending-token");
        return;
      }
    } catch {
      // treat error as not-yet-confirmed
    }

    retriesRef.current += 1;
    setRetryCount(retriesRef.current);

    if (retriesRef.current >= MAX_RETRIES) {
      setPageState("failed");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timerRef.current = setTimeout(verify, RETRY_DELAY_MS);
  }, [reference, tenantId]);

  useEffect(() => {
    verify();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [verify]);

  const goHome = () => navigate(ROUTES.home.fullPath);
  const goPowerToken = () => navigate(ROUTES.powerTokenQuota.fullPath);

  if (pageState === "loading") {
    return (
      <PageWrapper>
        <ContentCard>
          <SpinnerRing />
          <Typography variant="heading4" textColor="blue">
            Verifying Payment
          </Typography>
          <Typography variant="bodyBig">
            Please wait while we confirm your power token payment...
          </Typography>
          <RetryText>
            Attempt {retryCount + 1} of {MAX_RETRIES}
          </RetryText>
        </ContentCard>
      </PageWrapper>
    );
  }

  if (pageState === "success" && paymentData) {
    return (
      <PageWrapper>
        <ContentCard>
          <IconCircle $color="#e6f9ee">
            <span role="img" aria-label="success">
              ✅
            </span>
          </IconCircle>
          <Typography variant="heading4" textColor="blue">
            Payment Successful!
          </Typography>
          <Typography variant="bodyBig">
            Your power token payment of{" "}
            {currencyFormat(Number(paymentData.amount))} has been confirmed.
          </Typography>

          {paymentData.token && <CopyableToken token={paymentData.token} />}

          <div style={{ width: "100%" }}>
            <DetailRow>
              <DetailLabel>Meter</DetailLabel>
              <DetailValue>{paymentData.meter_pan}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Amount Paid</DetailLabel>
              <DetailValue>
                {currencyFormat(Number(paymentData.amount))}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Reference</DetailLabel>
              <DetailValue>{paymentData.reference}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{paymentData.payment_status}</DetailValue>
            </DetailRow>
            {paymentData.transaction_id && (
              <DetailRow>
                <DetailLabel>Transaction ID</DetailLabel>
                <DetailValue>{paymentData.transaction_id}</DetailValue>
              </DetailRow>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button text="View Power Token" onClick={goPowerToken} />
            <Button text="Back to Home" secondary onClick={goHome} />
          </div>
        </ContentCard>
      </PageWrapper>
    );
  }

  if (pageState === "paid-pending-token" && paymentData) {
    return (
      <PageWrapper>
        <ContentCard>
          <IconCircle $color="#e6f9ee">
            <span role="img" aria-label="success">
              ✅
            </span>
          </IconCircle>
          <Typography variant="heading4" textColor="blue">
            Payment Received!
          </Typography>
          <Typography variant="bodyBig">
            Your payment of {currencyFormat(Number(paymentData.amount))} has
            been received. Your power token will be delivered to your meter
            shortly.
          </Typography>

          <div style={{ width: "100%" }}>
            <DetailRow>
              <DetailLabel>Meter</DetailLabel>
              <DetailValue>{paymentData.meter_pan}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Amount Paid</DetailLabel>
              <DetailValue>
                {currencyFormat(Number(paymentData.amount))}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Reference</DetailLabel>
              <DetailValue>{paymentData.reference}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{paymentData.payment_status}</DetailValue>
            </DetailRow>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button text="View Power Token" onClick={goPowerToken} />
            <Button text="Back to Home" secondary onClick={goHome} />
          </div>
        </ContentCard>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ContentCard>
        <IconCircle $color="#fff8e1">
          <span role="img" aria-label="pending">
            ⏳
          </span>
        </IconCircle>
        <Typography variant="heading4" textColor="blue">
          Payment Verification Pending
        </Typography>
        <Typography variant="bodyBig">
          We couldn&apos;t confirm your payment yet. It may still be processing.
          Your token will be delivered to your meter once confirmed.
        </Typography>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button text="View Power Token" onClick={goPowerToken} />
          <Button text="Back to Home" secondary onClick={goHome} />
        </div>
      </ContentCard>
    </PageWrapper>
  );
};

export default ElectricityPaymentSuccessPage;
