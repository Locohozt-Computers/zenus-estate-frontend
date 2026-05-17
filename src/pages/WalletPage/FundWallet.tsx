import React, { ChangeEvent, useState } from "react";
import { Button, Input, Typography } from "components";
import { currencyFormat, strToNumOnly } from "utils/helpers";
import { VALIDATIONS } from "app-constants";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "components/atoms/Loader";
import * as yup from "yup";
import { ValidationError } from "yup";
import {
  generatePaymentLink,
  startFundingWallet,
} from "pages/WalletPage/request";
import { useSelector } from "react-redux";
import { clientSelectors } from "store/reducers/client/clientSlice";
import styled from "styled-components/macro";
import { AppIcon } from "utils";
import { HiOutlineCreditCard } from "react-icons/hi";
import { RiBankLine } from "react-icons/ri";
import { MdChevronRight, MdArrowBack } from "react-icons/md";
import { FundingProviderI } from "api/types";

const validationSchema = { amount: VALIDATIONS.amount };

/* ── Styled components ── */

const BackBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  color: var(--med-gray);
  font-size: 14px;

  &:hover {
    color: var(--blue);
  }
`;

const AmountSummary = styled.div`
  background: var(--light-gray);
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 24px;
  text-align: center;
`;

const MethodCard = styled.button`
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1.5px solid var(--gray-3);
  background: white;
  margin-bottom: 12px;
  box-sizing: border-box;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: var(--blue);
  }

  .method-icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .method-body {
    flex: 1;
  }
`;

const ProviderCard = styled.button<{ $selected?: boolean }>`
  all: unset;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid
    ${({ $selected }) => ($selected ? "var(--blue)" : "var(--gray-3)")};
  background: ${({ $selected }) => ($selected ? "var(--light-gray)" : "white")};
  box-sizing: border-box;
  margin-bottom: 10px;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--blue);
  }
`;

const ProviderLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: contain;
  background: var(--light-gray);
`;

const ProviderLogoFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--light-gray);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FeeBox = styled.div`
  background: var(--light-gray);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VirtualAccountCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid var(--gray-3);
  background: var(--light-gray);
  margin-bottom: 10px;

  .provider-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--med-gray);
    margin-bottom: 4px;
  }
`;

/* ── Types ── */
type Step = "amount" | "method" | "online" | "bank";

/* ── Component ── */
export const FundWallet = ({ onSuccess }: { onSuccess?: () => void }) => {
  const virtualAccounts = useSelector(clientSelectors.virtualAccounts);

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("0");
  const [err, setErr] = useState("");
  const [selectedProvider, setSelectedProvider] =
    useState<FundingProviderI | null>(null);
  const [fundingCalc, setFundingCalc] = useState<Awaited<
    ReturnType<typeof startFundingWallet>
  > | null>(null);

  const { mutate: calcFunding, isLoading: calcLoading } =
    useMutation(startFundingWallet);

  const { mutate: genLink, isLoading: genLinkLoading } =
    useMutation(generatePaymentLink);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (err) setErr("");
    setAmount(strToNumOnly(e.target.value));
  };

  const handleAmountContinue = async () => {
    try {
      await yup.object(validationSchema).validate({ amount });
      setStep("method");
    } catch (e) {
      setErr((e as ValidationError)?.message);
    }
  };

  const handleSelectOnline = () => {
    setStep("online");
    calcFunding(+amount, {
      onSuccess: (res) => setFundingCalc(res),
    });
  };

  const handleSelectBank = () => {
    setStep("bank");
  };

  const handlePay = () => {
    if (!selectedProvider) return;
    genLink(
      { amount: +amount, provider: selectedProvider.slug },
      {
        onSuccess: (res) => {
          window.location.href = res.payment_url;
        },
      }
    );
  };

  /* ── Step: Amount ── */
  if (step === "amount") {
    return (
      <>
        <Typography
          variant="heading5"
          style={{ textAlign: "start", marginBottom: 10 }}
        >
          Fund Wallet
        </Typography>
        <Input
          value={amount}
          name="amount"
          placeholder="Enter Amount"
          onChange={handleAmountChange}
          error={err}
        />
        <div style={{ marginTop: 30 }}>
          <Button
            disabled={+amount <= 0}
            text={`Pay ${currencyFormat(+amount)}`}
            onClick={() => {
              handleAmountContinue().catch(() => null);
            }}
          />
        </div>
      </>
    );
  }

  /* ── Step: Method selection ── */
  if (step === "method") {
    return (
      <div>
        <BackBtn onClick={() => setStep("amount")}>
          <AppIcon render={MdArrowBack} size={18} />
          Back
        </BackBtn>

        <AmountSummary>
          <Typography size={13} style={{ color: "var(--med-gray)" }}>
            Amount to fund
          </Typography>
          <Typography variant="heading4" style={{ marginTop: 4 }}>
            {currencyFormat(+amount)}
          </Typography>
        </AmountSummary>

        <Typography
          size={13}
          style={{ color: "var(--med-gray)", marginBottom: 14 }}
        >
          Select payment method
        </Typography>

        <MethodCard onClick={handleSelectOnline}>
          <div className="method-icon">
            <AppIcon
              render={HiOutlineCreditCard}
              size={20}
              color="var(--blue)"
            />
          </div>
          <div className="method-body">
            <Typography size={14} weight={600}>
              Pay with Online Check-out
            </Typography>
            <Typography size={12} style={{ color: "var(--med-gray)" }}>
              Pay via card or online gateway
            </Typography>
          </div>
          <AppIcon render={MdChevronRight} size={20} color="var(--med-gray)" />
        </MethodCard>

        <MethodCard onClick={handleSelectBank}>
          <div className="method-icon">
            <AppIcon render={RiBankLine} size={20} color="var(--blue)" />
          </div>
          <div className="method-body">
            <Typography size={14} weight={600}>
              Pay with Bank Transfer
            </Typography>
            <Typography size={12} style={{ color: "var(--med-gray)" }}>
              Transfer directly from your bank
            </Typography>
          </div>
          <AppIcon render={MdChevronRight} size={20} color="var(--med-gray)" />
        </MethodCard>
      </div>
    );
  }

  /* ── Step: Online providers ── */
  if (step === "online") {
    return (
      <div>
        <Loader absolute open={calcLoading || genLinkLoading} />
        <BackBtn onClick={() => setStep("method")}>
          <AppIcon render={MdArrowBack} size={18} />
          Back
        </BackBtn>
        <Typography
          variant="heading5"
          style={{ marginBottom: 6, textAlign: "start" }}
        >
          Choose payment provider
        </Typography>
        <Typography
          size={13}
          style={{ color: "var(--med-gray)", marginBottom: 20 }}
        >
          Paying {currencyFormat(+amount)}
        </Typography>

        {fundingCalc && (
          <FeeBox>
            <FeeRow>
              <Typography size={13} style={{ color: "var(--med-gray)" }}>
                Requested amount
              </Typography>
              <Typography size={13} weight={600}>
                ₦{fundingCalc.requested_amount}
              </Typography>
            </FeeRow>
            <FeeRow>
              <Typography size={13} style={{ color: "var(--med-gray)" }}>
                Processing fee
              </Typography>
              <Typography size={13} weight={600}>
                ₦{fundingCalc.charge_fee}
              </Typography>
            </FeeRow>
            <FeeRow>
              <Typography size={13} style={{ color: "var(--med-gray)" }}>
                Total to pay
              </Typography>
              <Typography
                size={14}
                weight={700}
                style={{ color: "var(--blue)" }}
              >
                ₦{fundingCalc.total_amount_to_pay}
              </Typography>
            </FeeRow>
          </FeeBox>
        )}

        {!calcLoading && !fundingCalc?.providers?.length && (
          <Typography style={{ color: "var(--med-gray)", textAlign: "center" }}>
            No payment providers available.
          </Typography>
        )}

        {fundingCalc?.providers?.map((p) => (
          <ProviderCard
            key={p.slug}
            $selected={selectedProvider?.slug === p.slug}
            onClick={() => setSelectedProvider(p)}
          >
            {p.image ? (
              <ProviderLogo src={p.image} alt={p.name} />
            ) : (
              <ProviderLogoFallback>
                <AppIcon
                  render={HiOutlineCreditCard}
                  size={18}
                  color="var(--blue)"
                />
              </ProviderLogoFallback>
            )}
            <div style={{ flex: 1 }}>
              <Typography size={14} weight={600}>
                {p.name}
              </Typography>
              {p.description && (
                <Typography size={12} style={{ color: "var(--med-gray)" }}>
                  {p.description}
                </Typography>
              )}
            </div>
          </ProviderCard>
        ))}

        {selectedProvider && (
          <div style={{ marginTop: 16 }}>
            <Button
              text={`Pay with ${selectedProvider.name}`}
              loading={genLinkLoading}
              onClick={handlePay}
            />
          </div>
        )}
      </div>
    );
  }

  /* ── Step: Bank Transfer ── */
  if (step === "bank") {
    return (
      <div>
        <BackBtn onClick={() => setStep("method")}>
          <AppIcon render={MdArrowBack} size={18} />
          Back
        </BackBtn>
        <Typography
          variant="heading5"
          style={{ marginBottom: 6, textAlign: "start" }}
        >
          Bank Transfer
        </Typography>
        <Typography
          size={13}
          style={{ color: "var(--med-gray)", marginBottom: 20 }}
        >
          Transfer {currencyFormat(+amount)} to any of the accounts below
        </Typography>

        {virtualAccounts.length === 0 && (
          <Typography style={{ color: "var(--med-gray)", textAlign: "center" }}>
            No virtual accounts available. Please contact support.
          </Typography>
        )}

        {virtualAccounts.map((acc) => (
          <VirtualAccountCard key={acc.provider}>
            <p className="provider-label">{acc.provider}</p>
            <Typography weight={600} size={15} style={{ display: "block" }}>
              {acc.account_number}
            </Typography>
            <Typography size={13} style={{ color: "var(--med-gray)" }}>
              {acc.account_name} · {acc.bank_name}
            </Typography>
          </VirtualAccountCard>
        ))}

        {onSuccess && virtualAccounts.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <Button text="I have made the transfer" onClick={onSuccess} />
          </div>
        )}
      </div>
    );
  }

  return null;
};
