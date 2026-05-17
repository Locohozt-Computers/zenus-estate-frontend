import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Button, Card } from "components";
import { ROUTES } from "app-constants";
import { verifyWalletFunding } from "pages/WalletPage/request";
import { getUserProfile } from "pages/request";
import { currencyFormat } from "utils/helpers";

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

type State = "loading" | "success" | "pending";

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

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const trxref = searchParams.get("trxref") ?? "";
  const reference = searchParams.get("reference") ?? "";

  const [pageState, setPageState] = useState<State>("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [amount, setAmount] = useState<number | null>(null);

  const retriesRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshWalletBalance = useCallback(async () => {
    try {
      await getUserProfile();
    } catch {
      // non-critical
    }
  }, []);

  const poll = useCallback(async () => {
    if (!trxref || !reference) {
      setPageState("pending");
      return;
    }

    try {
      const res = await verifyWalletFunding({ trxref, reference });
      if (res?.data?.is_successful) {
        setAmount(Number(res.data.amount) || null);
        setPageState("success");
        refreshWalletBalance();
        return;
      }
    } catch {
      // treat error as not-yet-confirmed
    }

    retriesRef.current += 1;
    setRetryCount(retriesRef.current);

    if (retriesRef.current >= MAX_RETRIES) {
      setPageState("pending");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    timerRef.current = setTimeout(poll, RETRY_DELAY_MS);
  }, [trxref, reference, refreshWalletBalance]);

  useEffect(() => {
    poll();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll]);

  const goHome = () => navigate(ROUTES.home.fullPath);
  const goWallet = () => navigate(ROUTES.myWallet.fullPath);

  if (pageState === "loading") {
    return (
      <PageWrapper>
        <ContentCard>
          <SpinnerRing />
          <Typography variant="heading4" textColor="blue">
            Verifying Payment
          </Typography>
          <Typography variant="bodyBig">
            Please wait while we confirm your wallet funding...
          </Typography>
          <RetryText>
            Attempt {retryCount + 1} of {MAX_RETRIES}
          </RetryText>
        </ContentCard>
      </PageWrapper>
    );
  }

  if (pageState === "success") {
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
          {amount !== null && (
            <Typography variant="bodyBig">
              {currencyFormat(amount)} has been added to your wallet.
            </Typography>
          )}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button text="Go to Wallet" onClick={goWallet} />
            <Button text="Back to Home" secondary onClick={goHome} />
          </div>
        </ContentCard>
      </PageWrapper>
    );
  }

  // pending state
  return (
    <PageWrapper>
      <ContentCard>
        <IconCircle $color="#fff8e1">
          <span role="img" aria-label="pending">
            ⏳
          </span>
        </IconCircle>
        <Typography variant="heading4" textColor="blue">
          Transaction In Process
        </Typography>
        <Typography variant="bodyBig">
          Your payment is being processed. You will be notified once it has been
          confirmed.
        </Typography>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button text="Go to Wallet" onClick={goWallet} />
          <Button text="Back to Home" secondary onClick={goHome} />
        </div>
      </ContentCard>
    </PageWrapper>
  );
};

export default PaymentSuccessPage;
