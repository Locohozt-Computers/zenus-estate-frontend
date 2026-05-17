import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardContent } from "layouts";
import {
  getBills,
  getUserProfile,
  postPayWithWalletBill,
  postDemandNoticePaymentLinksRegenerate,
} from "pages/request";
import { notification } from "services";
import { BillI, BillPaymentLinkI } from "api";
import { Loader } from "components/atoms/Loader";
import { Modal } from "components/atoms/Modal";
import { Card } from "components/atoms";
import {
  BottomSheet,
  SheetBody,
  SheetClose,
  SheetHandle,
  SheetHeader,
  SheetTitleGroup,
} from "components/molecules";
import { FiX } from "react-icons/fi";
import { Typography } from "components/atoms/Typography";
import { pxToEm } from "utils";
import { currencyFormat } from "utils/helpers";
import {
  MdAccountBalanceWallet,
  MdAccountBalance,
  MdShoppingCart,
  MdArrowBack,
} from "react-icons/md";

/* ── helpers ── */

function statusBg(status: string): string {
  if (status === "pending") return "#FEF3C7";
  if (status === "paid") return "#D1FAE5";
  return "#F3F4F6";
}

function statusColor(status: string): string {
  if (status === "pending") return "#D97706";
  if (status === "paid") return "#059669";
  return "#6B7280";
}

/* ── styled components ── */

const PageWrapper = styled.div`
  padding: 24px 0;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

const BillCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media screen and (min-width: ${pxToEm(600, false)}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const BillInfo = styled.div`
  flex: 1;
`;

const BillTitle = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1a2e;
  margin-bottom: 4px;
  font-family: "Montserrat", sans-serif;
`;

const BillMeta = styled.p`
  font-size: 0.8rem;
  color: #888;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 2px;
`;

const BillAmount = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--blue);
  font-family: "Montserrat", sans-serif;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  background-color: ${({ status }) => statusBg(status)};
  color: ${({ status }) => statusColor(status)};
`;

const PayButton = styled.button`
  all: unset;
  cursor: pointer;
  background-color: var(--blue);
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    transform: scale(0.97);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-family: "Montserrat", sans-serif;
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

const BillAmountRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`;

/* ── Modal shared styles ── */

const MethodCard = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f8faff;
  border: 1.5px solid #e0e7ff;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: var(--blue);
    background: #eff4ff;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const MethodIconCircle = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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

/* ── Wallet Modal ── */

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

const ConfirmButton = styled.button`
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background-color: var(--blue);
  color: white;
  padding: 14px;
  border-radius: 28px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
  margin-top: 20px;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

const InsufficientNote = styled.p`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 12px;
  font-family: "Montserrat", sans-serif;
`;

const ComingSoonBox = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #888;
  font-family: "Montserrat", sans-serif;
  font-size: 0.9rem;
`;

const ComingSoonNote = styled.p`
  margin-top: 8px;
  font-size: 0.8rem;
`;

/* ── Checkout Modal ── */

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

/* ── PIN input ── */

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

/* ── Types ── */

type PaymentStep = "method" | "wallet" | "bank" | "checkout";
type WalletSubStep = "summary" | "pin";

/* ── Component ── */

const CommunityDuesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedBill, setSelectedBill] = useState<BillI | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep | null>(null);
  const [walletSubStep, setWalletSubStep] = useState<WalletSubStep>("summary");
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [regeneratedPaymentLinks, setRegeneratedPaymentLinks] = useState<
    BillPaymentLinkI[]
  >([]);
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { data: bills, isLoading: billsLoading } = useQuery(
    [getBills.key],
    getBills
  );

  const { data: profile, isLoading: profileLoading } = useQuery(
    [getUserProfile.key],
    getUserProfile
  );

  const isLoading = billsLoading || profileLoading;

  const { mutate: regeneratePaymentLinks, isLoading: isRegeneratingLinks } =
    useMutation(postDemandNoticePaymentLinksRegenerate, {
      onSuccess: (links) => {
        setRegeneratedPaymentLinks(links);
      },
      onError: () => {
        notification.error("Failed to regenerate payment links");
      },
    });

  const closeAll = () => {
    setSelectedBill(null);
    setPaymentStep(null);
    setWalletSubStep("summary");
    setDigits(["", "", "", ""]);
    setRegeneratedPaymentLinks([]);
  };

  const openPayment = (bill: BillI) => {
    setSelectedBill(bill);
    setPaymentStep("method");
  };

  const openCheckoutPayment = (bill: BillI) => {
    setRegeneratedPaymentLinks([]);
    regeneratePaymentLinks({
      invoice_id: bill.id,
      customer_id: bill.customer.id,
      branch_id: 1,
    });
    setPaymentStep("checkout");
  };

  const { mutate: payWithWallet, isLoading: isPaying } = useMutation(
    postPayWithWalletBill,
    {
      onSuccess: (res) => {
        notification.success(res?.message || "Payment successful");
        queryClient.invalidateQueries([getBills.key]);
        queryClient.invalidateQueries([getUserProfile.key]);
        closeAll();
      },
    }
  );

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
    if (!selectedBill) return;
    payWithWallet({ invoice_no: selectedBill.invoice_no, pin });
  };

  const walletBalance = parseFloat(profile?.walletBalance ?? "0");
  const billAmount = selectedBill?.balance_due ?? 0;
  const insufficient = walletBalance < billAmount;

  return (
    <DashboardContent>
      <PageWrapper>
        <BackButton onClick={() => navigate(-1)}>
          <MdArrowBack size={18} />
          Back
        </BackButton>
        <PageTitle>Pay Community Dues</PageTitle>

        {isLoading && <Loader open absolute />}

        {!isLoading && (!bills || bills.length === 0) && (
          <EmptyState>No bills found.</EmptyState>
        )}

        {bills?.map((bill) => (
          <BillCard key={bill.id}>
            <BillInfo>
              <BillTitle>{bill.description}</BillTitle>
              <BillMeta>Invoice: {bill.invoice_no}</BillMeta>
              <BillMeta>
                Property: {bill.customer.house_no} &mdash; {bill.customer.name}
              </BillMeta>
              {bill.payment_due_date && (
                <BillMeta>Due: {bill.payment_due_date}</BillMeta>
              )}
              <BillAmountRow>
                <BillAmount>{currencyFormat(bill.balance_due)}</BillAmount>
                <StatusBadge status={bill.status}>{bill.status}</StatusBadge>
              </BillAmountRow>
            </BillInfo>
            {bill.status === "pending" && (
              <PayButton onClick={() => openPayment(bill)}>Pay Now</PayButton>
            )}
          </BillCard>
        ))}

        {/* ── Payment Method Selection Sheet ── */}
        <BottomSheet open={paymentStep === "method"} onClose={closeAll}>
          <SheetHandle />
          <SheetHeader>
            <SheetTitleGroup>
              <div>
                <Typography variant="subtitle" weight={600}>
                  Choose Payment Method
                </Typography>
                <ModalSubtitle>
                  {selectedBill?.description} &mdash;{" "}
                  {selectedBill ? currencyFormat(selectedBill.balance_due) : ""}
                </ModalSubtitle>
              </div>
            </SheetTitleGroup>
            <SheetClose type="button" aria-label="Close" onClick={closeAll}>
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

            <MethodCard onClick={() => setPaymentStep("bank")}>
              <MethodIconCircle color="#DBEAFE">
                <MdAccountBalance size={22} color="#2563EB" />
              </MethodIconCircle>
              <MethodLabel>
                <MethodTitle>Pay with Bank Transfer</MethodTitle>
                <MethodSubtitle>
                  Transfer to a designated bank account
                </MethodSubtitle>
              </MethodLabel>
            </MethodCard>

            <MethodCard
              onClick={() => selectedBill && openCheckoutPayment(selectedBill)}
            >
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
                  <WalletValue>
                    {selectedBill
                      ? currencyFormat(selectedBill.balance_due)
                      : "-"}
                  </WalletValue>
                </WalletRow>
                <WalletRow>
                  <WalletLabel>Balance After Payment</WalletLabel>
                  <WalletValue>
                    {selectedBill
                      ? currencyFormat(Math.max(0, walletBalance - billAmount))
                      : "-"}
                  </WalletValue>
                </WalletRow>

                {insufficient && (
                  <InsufficientNote>
                    Insufficient wallet balance. Please top up or choose another
                    payment method.
                  </InsufficientNote>
                )}

                <ConfirmButton
                  disabled={insufficient}
                  onClick={() => setWalletSubStep("pin")}
                >
                  Confirm Payment
                </ConfirmButton>
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

                <ConfirmButton disabled={isPaying} onClick={handleWalletPay}>
                  {isPaying ? "Processing..." : "Pay Now"}
                </ConfirmButton>
              </>
            )}
          </Card>
        </Modal>

        {/* ── Bank Transfer Modal ── */}
        <Modal
          visible={paymentStep === "bank"}
          closeModal={() => setPaymentStep("method")}
          maxWidth={400}
          showCloseBtn
        >
          <Card style={{ padding: "32px 24px" }}>
            <ModalTitle>Pay with Bank Transfer</ModalTitle>
            <ComingSoonBox>
              <MdAccountBalance size={48} color="#CBD5E1" />
              <p>Bank transfer payment is coming soon.</p>
              <ComingSoonNote>
                Please use another payment method for now.
              </ComingSoonNote>
            </ComingSoonBox>
          </Card>
        </Modal>

        {/* ── Checkout Modal ── */}
        <Modal
          visible={paymentStep === "checkout"}
          closeModal={() => setPaymentStep("method")}
          maxWidth={440}
          showCloseBtn
        >
          <Card style={{ padding: "32px 24px" }}>
            <ModalTitle>Pay with Checkout</ModalTitle>
            <ModalSubtitle>
              Select your preferred payment provider
            </ModalSubtitle>

            {isRegeneratingLinks && (
              <ComingSoonBox>
                <Loader open absolute />
              </ComingSoonBox>
            )}

            {!isRegeneratingLinks &&
              regeneratedPaymentLinks.length > 0 &&
              regeneratedPaymentLinks?.map((link) => (
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

            {!isRegeneratingLinks && regeneratedPaymentLinks.length === 0 && (
              <ComingSoonBox>
                No checkout options available for this bill.
              </ComingSoonBox>
            )}
          </Card>
        </Modal>
      </PageWrapper>
    </DashboardContent>
  );
};

export default CommunityDuesPage;
