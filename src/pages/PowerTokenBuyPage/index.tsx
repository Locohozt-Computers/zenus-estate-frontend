import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MdAccountBalanceWallet,
  MdArrowBack,
  MdShoppingCart,
} from "react-icons/md";

import { DashboardContent } from "layouts";
import { Loader } from "components/atoms/Loader";
import { Modal } from "components/atoms/Modal";
import { Card, Typography } from "components/atoms";
import {
  BottomSheet,
  SheetBody,
  SheetClose,
  SheetHandle,
  SheetHeader,
  SheetTitleGroup,
} from "components/molecules";
import { FiX } from "react-icons/fi";
import {
  getElectricityQuotaUsage,
  getMeter,
  getUserProfile,
  postElectricityPaymentLinksGenerate,
  postMeterTispTokenBuyWithWallet,
} from "pages/request";
import { notification } from "services";
import { useAppSelector } from "store";
import { clientSelectors } from "store/reducers/client/clientSlice";
import { ROUTES } from "app-constants";
import { currencyFormat } from "utils/helpers";
import { BillPaymentLinkI } from "api";

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

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #555;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 24px;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  margin-bottom: 16px;
`;

const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-size: 0.85rem;
  color: #555;
  font-family: "Montserrat", sans-serif;
`;

const FieldValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  font-family: "Montserrat", sans-serif;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  font-family: "Montserrat", sans-serif;
  margin: 16px 0 8px;
`;

const AmountInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1.5px solid var(--gray-3, #e5e7eb);
  border-radius: 10px;
  font-size: 1rem;
  font-family: "Montserrat", sans-serif;
  color: #1f2937;
  outline: none;

  &:focus {
    border-color: var(--blue);
  }
`;

const PrimaryButton = styled.button`
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background: var(--blue);
  color: white;
  padding: 14px 16px;
  border-radius: 28px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  margin-top: 20px;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
  font-family: "Montserrat", sans-serif;
`;

const ModalSubtitle = styled.p`
  font-size: 0.82rem;
  color: #888;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

const MethodCard = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8faff;
  border: 1.5px solid #e0e7ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ disabled }) => (disabled ? "#e0e7ff" : "var(--blue)")};
    background: ${({ disabled }) => (disabled ? "#f8faff" : "#eff4ff")};
  }
`;

const CheckoutOption = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8faff;
  border: 1.5px solid #e0e7ff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--blue);
    background: #eff4ff;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProviderLogo = styled.img`
  height: 28px;
  object-fit: contain;
  max-width: 80px;
`;

const CheckoutInfo = styled.div`
  flex: 1;
`;

const CheckoutName = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a2e;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2px;
`;

const CheckoutDetail = styled.p`
  font-size: 0.75rem;
  color: #888;
  font-family: "Montserrat", sans-serif;
`;

const CheckoutEmpty = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #888;
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
`;

const MethodIconCircle = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ color }) => color};
`;

const MethodLabel = styled.div`
  flex: 1;
`;

const MethodTitle = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a2e;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2px;
`;

const MethodSubtitle = styled.p`
  font-size: 0.75rem;
  color: #888;
  font-family: "Montserrat", sans-serif;
`;

const WalletRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const WalletLabel = styled.p`
  font-size: 0.85rem;
  color: #666;
  font-family: "Montserrat", sans-serif;
`;

const WalletValue = styled.p<{ warn?: boolean }>`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ warn }) => (warn ? "#DC2626" : "#1a1a2e")};
  font-family: "Montserrat", sans-serif;
`;

const InsufficientNote = styled.p`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 12px;
  font-family: "Montserrat", sans-serif;
`;

const PinWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 24px 0;
`;

const PinInput = styled.input`
  width: 52px;
  height: 60px;
  border: 2px solid var(--gray-3);
  border-radius: 10px;
  font-size: 24px;
  text-align: center;
  outline: none;
  background: transparent;
  color: var(--blue);
  caret-color: transparent;
  font-family: "Montserrat", sans-serif;

  &:focus {
    border-color: var(--blue);
  }
`;

const PinLabel = styled.p`
  font-size: 0.85rem;
  color: #555;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 4px;
`;

type PaymentStep = "form" | "method" | "wallet" | "checkout";
type WalletSubStep = "summary" | "pin";

const PowerTokenBuyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedProperty = useAppSelector(clientSelectors.selectedProperty);
  const meterId = selectedProperty?.meters?.[0]?.id ?? null;

  const [amount, setAmount] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("form");
  const [walletSubStep, setWalletSubStep] = useState<WalletSubStep>("summary");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [checkoutLinks, setCheckoutLinks] = useState<BillPaymentLinkI[]>([]);
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!meterId) {
      notification.error(
        "No meter is linked to the selected property. Please contact your facility manager."
      );
      navigate(ROUTES.utilities.fullPath);
    }
  }, [meterId, navigate]);

  const { data: meter, isLoading: meterLoading } = useQuery(
    [getMeter.key, meterId],
    () => getMeter(meterId as number),
    { enabled: !!meterId }
  );

  const { data: profile } = useQuery([getUserProfile.key], getUserProfile);

  const walletBalance = parseFloat(profile?.walletBalance ?? "0");
  const numericAmount = parseFloat(amount || "0");
  const insufficient = walletBalance < numericAmount;

  const closeAll = () => {
    setPaymentStep("form");
    setWalletSubStep("summary");
    setDigits(["", "", "", ""]);
    setCheckoutLinks([]);
  };

  const { mutate: payWithWallet, isLoading: isPaying } = useMutation(
    postMeterTispTokenBuyWithWallet,
    {
      onSuccess: (res) => {
        notification.success(res?.message || "Token purchase successful");
        queryClient.invalidateQueries([getUserProfile.key]);
        queryClient.invalidateQueries([getElectricityQuotaUsage.key]);
        closeAll();
        navigate(ROUTES.paymentSuccess.fullPath);
      },
    }
  );

  const { mutate: generateCheckoutLinks, isLoading: isGeneratingLinks } =
    useMutation(postElectricityPaymentLinksGenerate, {
      onSuccess: (links) => {
        setCheckoutLinks(links);
      },
      onError: () => {
        notification.error("Failed to generate payment links");
      },
    });

  const openCheckoutPayment = () => {
    if (!meterId || !meter) {
      notification.error("Meter details are still loading. Please try again.");
      return;
    }
    setCheckoutLinks([]);
    generateCheckoutLinks({
      meter_id: meterId,
      amount: numericAmount,
      levy_id: meter.levy_setup.id,
    });
    setPaymentStep("checkout");
  };

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleWalletPay = () => {
    const pin = parseInt(digits.join(""), 10);
    if (digits.some((d) => d === "") || Number.isNaN(pin)) {
      notification.error("Please enter your 4-digit PIN");
      return;
    }
    if (!meterId || !meter) {
      notification.error("Meter details are still loading. Please try again.");
      return;
    }
    payWithWallet({
      meterPan: meterId,
      amount: numericAmount,
      pin,
      levy_id: meter.levy_setup.id,
    });
  };

  const handleContinue = () => {
    if (!numericAmount || numericAmount <= 0) {
      notification.error("Please enter a valid amount");
      return;
    }
    if (!meter) {
      notification.error("Meter details are still loading. Please try again.");
      return;
    }
    setPaymentStep("method");
  };

  return (
    <DashboardContent>
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
          Back
        </BackButton>
        <Title>Buy Power Token</Title>
        <Subtitle>
          Enter the amount you want to recharge for your meter.
        </Subtitle>

        {meterLoading && <Loader open absolute />}

        {meter && (
          <FormCard>
            <FieldRow>
              <FieldLabel>Meter Number</FieldLabel>
              <FieldValue>{meter.meter_number}</FieldValue>
            </FieldRow>

            <InputLabel htmlFor="power-token-amount">Amount (₦)</InputLabel>
            <AmountInput
              id="power-token-amount"
              type="number"
              min={1}
              step={1}
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <PrimaryButton
              disabled={!numericAmount || numericAmount <= 0}
              onClick={handleContinue}
            >
              Continue
            </PrimaryButton>
          </FormCard>
        )}

        {/* ── Method Selection Sheet ── */}
        <BottomSheet
          open={paymentStep === "method"}
          onClose={() => setPaymentStep("form")}
        >
          <SheetHandle />
          <SheetHeader>
            <SheetTitleGroup>
              <div>
                <Typography variant="subtitle" weight={600}>
                  Choose Payment Method
                </Typography>
                <ModalSubtitle>
                  {meter?.meter_number} &mdash; {currencyFormat(numericAmount)}
                </ModalSubtitle>
              </div>
            </SheetTitleGroup>
            <SheetClose
              type="button"
              aria-label="Close"
              onClick={() => setPaymentStep("form")}
            >
              <FiX size={18} />
            </SheetClose>
          </SheetHeader>
          <SheetBody>
            <MethodCard onClick={() => setPaymentStep("wallet")}>
              <MethodIconCircle color="#D1FAE5">
                <MdAccountBalanceWallet size={22} color="#059669" />
              </MethodIconCircle>
              <MethodLabel>
                <MethodTitle>Pay with Wallet</MethodTitle>
                <MethodSubtitle>
                  Instant deduction from your wallet
                </MethodSubtitle>
              </MethodLabel>
            </MethodCard>

            <MethodCard onClick={openCheckoutPayment}>
              <MethodIconCircle color="#EDE9FE">
                <MdShoppingCart size={22} color="#7C3AED" />
              </MethodIconCircle>
              <MethodLabel>
                <MethodTitle>Pay with Checkout</MethodTitle>
                <MethodSubtitle>
                  Pay via card or other online options
                </MethodSubtitle>
              </MethodLabel>
            </MethodCard>
          </SheetBody>
        </BottomSheet>

        {/* ── Wallet Payment Modal ── */}
        <Modal
          visible={paymentStep === "wallet"}
          closeModal={() => {
            setPaymentStep("method");
            setWalletSubStep("summary");
            setDigits(["", "", "", ""]);
          }}
          maxWidth={400}
          showCloseBtn
        >
          <Card style={{ padding: "32px 24px" }}>
            {walletSubStep === "summary" && (
              <>
                <ModalTitle>Pay with Wallet</ModalTitle>
                <ModalSubtitle>Review your payment details below</ModalSubtitle>

                <WalletRow>
                  <WalletLabel>Wallet Balance</WalletLabel>
                  <WalletValue warn={insufficient}>
                    {currencyFormat(walletBalance)}
                  </WalletValue>
                </WalletRow>
                <WalletRow>
                  <WalletLabel>Amount to Pay</WalletLabel>
                  <WalletValue>{currencyFormat(numericAmount)}</WalletValue>
                </WalletRow>
                <WalletRow>
                  <WalletLabel>Balance After Payment</WalletLabel>
                  <WalletValue>
                    {currencyFormat(Math.max(0, walletBalance - numericAmount))}
                  </WalletValue>
                </WalletRow>

                {insufficient && (
                  <InsufficientNote>
                    Insufficient wallet balance. Please top up or choose another
                    payment method.
                  </InsufficientNote>
                )}

                <PrimaryButton
                  disabled={insufficient}
                  onClick={() => setWalletSubStep("pin")}
                >
                  Confirm Payment
                </PrimaryButton>
              </>
            )}

            {walletSubStep === "pin" && (
              <>
                <ModalTitle>Enter PIN</ModalTitle>
                <ModalSubtitle>
                  Enter your 4-digit authorization PIN to complete the payment
                </ModalSubtitle>

                <PinLabel>Authorization PIN</PinLabel>
                <PinWrapper>
                  {digits.map((digit, i) => (
                    <PinInput
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      ref={pinRefs[i]}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                    />
                  ))}
                </PinWrapper>

                <PrimaryButton disabled={isPaying} onClick={handleWalletPay}>
                  {isPaying ? "Processing..." : "Pay Now"}
                </PrimaryButton>
              </>
            )}
          </Card>
        </Modal>

        {/* ── Checkout Modal ── */}
        <Modal
          visible={paymentStep === "checkout"}
          closeModal={() => {
            setPaymentStep("method");
            setCheckoutLinks([]);
          }}
          maxWidth={440}
          showCloseBtn
        >
          <Card style={{ padding: "32px 24px" }}>
            <ModalTitle>Pay with Checkout</ModalTitle>
            <ModalSubtitle>
              Select your preferred payment provider
            </ModalSubtitle>

            {isGeneratingLinks && (
              <CheckoutEmpty>
                <Loader open absolute />
              </CheckoutEmpty>
            )}

            {!isGeneratingLinks &&
              checkoutLinks.length > 0 &&
              checkoutLinks.map((link) => (
                <CheckoutOption
                  key={link.reference}
                  href={link.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ProviderLogo
                    src={link.logo}
                    alt={link.name}
                    onError={(e) => {
                      // eslint-disable-next-line no-param-reassign
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <CheckoutInfo>
                    <CheckoutName>{link.name}</CheckoutName>
                    <CheckoutDetail>
                      Amount: {currencyFormat(link.amount_charged)}
                      {link.fee > 0 &&
                        ` (incl. fee: ${currencyFormat(link.fee)})`}
                    </CheckoutDetail>
                  </CheckoutInfo>
                </CheckoutOption>
              ))}

            {!isGeneratingLinks && checkoutLinks.length === 0 && (
              <CheckoutEmpty>
                No checkout options available for this payment.
              </CheckoutEmpty>
            )}
          </Card>
        </Modal>
      </PageWrapper>
    </DashboardContent>
  );
};

export default PowerTokenBuyPage;
