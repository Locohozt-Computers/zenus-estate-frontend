import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Balanceimg from "assets/images/balanceimg.png";
import {
  Button,
  Card,
  Modal,
  TFilter,
  Typography,
  UlStyle,
  WalletCard,
} from "components";
import { AppIcon, pxToEm } from "utils";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getWalletTransactions } from "pages/request";
import { currencyFormat } from "utils/helpers";
import { Loader } from "components/atoms/Loader";
import { PropsI } from "pages/WalletPage/types";
import { TransactionI, TransactionTypeEnum } from "api";
import { getBankAccounts } from "pages/WalletPage/request";
import { FundWallet } from "pages/WalletPage/FundWallet";
import { notification } from "services";
import { useScrollWithin } from "hooks";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const StyledDiv = styled.div`
  position: relative;

  .btn-section {
    margin-bottom: ${pxToEm(40)};
    gap: 15px;

    display: flex;
    flex-direction: column;

    > button {
      max-width: 110px;
    }

    @media screen and (min-width: ${pxToEm(900, false)}) {
      flex-direction: row;
      > button {
        max-width: 100%;
      }
    }
  }
`;

const PaymentHistory = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  padding: 30px;
  background-color: #fefbfe;
  margin-bottom: 20px;
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow: auto;
  display: grid;
  gap: 10px;
  padding: 10px;
`;

const CustomCard = styled(Card)`
  background: url(${Balanceimg});
  height: 243px;
  margin-bottom: 65px;
`;

const CustomButton = styled(Button)`
  width: 100%;
`;

const TransactionSnippetLoader = styled.div`
  position: relative;
  height: 98px;
  border-radius: 8px;
  background: white;
  overflow: hidden;
`;

const filterOptions = [
  { label: "All", value: "" },
  { label: "Credit", value: TransactionTypeEnum.Credit },
  { label: "Debit", value: TransactionTypeEnum.Debit },
];

export const WalletOverview = ({ setPage }: PropsI) => {
  const [showBalance, setShowBalance] = useState(true);

  const [transactions, setTransactions] = useState<Array<TransactionI>>([]);

  const [withdrawState, setWithdrawState] = useState<
    "no-funds" | "no-account" | null
  >(null);

  const [filterTransactions, setFilterTransaction] = useState<
    TransactionTypeEnum | undefined
  >(undefined);

  const [transPaginationInfo, setTransPaginationInfo] = useState({
    current: 1,
    perPage: 10,
    total: 0,
    hasNext: "" as string | null,
  });

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    refetch: refetchTransaction,
    isFetching: isFetchingTransaction,
  } = useQuery(["getWalletTransactions", filterTransactions], () =>
    getWalletTransactions({ trans_type: filterTransactions })
  );

  const transactionPagination = useCallback(() => {
    if (transPaginationInfo.hasNext) {
      (async () => {
        const res = await getWalletTransactions({
          page: transPaginationInfo.current + 1,
          trans_type: filterTransactions,
        });
        setTransactions(transactions.concat(res.data));
        setTransPaginationInfo({
          perPage: res?.per_page,
          current: res.current_page,
          total: res.total,
          hasNext: res.next_page_url,
        });
      })();
    }
  }, [filterTransactions, transPaginationInfo, transactions]);

  const { ref: transactionRef } = useScrollWithin(transactionPagination, []);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
    isFetching: isFetchingProfile,
  } = useQuery(["getUserProfile"], getUserProfile);

  const { data: bankAccounts, isLoading: bankAccLoading } = useQuery(
    ["getBankAccounts"],
    getBankAccounts
  );

  const onFilter = (event: React.MouseEvent<any>) => {
    const transType = (event.target as any)?.id;
    setFilterTransaction(transType as TransactionTypeEnum);
  };

  const handleAddFunds = () => {
    setWithdrawState("no-funds");
  };

  const handleWithdraw = () => {
    // check if user has added bank details
    if (!bankAccounts?.length) {
      setWithdrawState("no-account");
    } else if (!profile?.walletBalance || profile?.walletBalance <= 0) {
      // check if wallet has funds
      handleAddFunds();
    } else setPage(2);
  };

  const handleUpdateFunds = () => {
    // update wallet with new amount
    Promise.all([refetchProfile(), refetchTransaction()]).then(() => {
      notification.info("Data Updated!");
    });
  };

  useEffect(() => {
    if (transactionsData) {
      setTransactions(transactionsData.data);
      setTransPaginationInfo({
        perPage: transactionsData?.per_page,
        current: transactionsData.current_page,
        total: transactionsData.total,
        hasNext: transactionsData.next_page_url,
      });
    }
  }, [transactionsData]);

  return (
    <StyledDiv>
      <Modal
        maxWidth={620}
        visible={!!withdrawState}
        closeModal={() => setWithdrawState(null)}
      >
        <Card style={{ padding: "40px 20px" }}>
          <div style={{ maxWidth: 480, textAlign: "center", margin: "auto" }}>
            {withdrawState === "no-account" && (
              <>
                <Typography variant="heading4" content="Caution" />
                <Typography
                  variant="bodyBig"
                  content="You are yet to add an account, add your bank details to request balance withdrawal."
                />
                <Button
                  text="Add Account Details"
                  style={{ marginTop: 30 }}
                  onClick={() => setPage(!bankAccounts?.length ? 2 : 3)}
                />
              </>
            )}
            {withdrawState === "no-funds" && (
              <FundWallet onSuccess={handleUpdateFunds} />
            )}
          </div>
        </Card>
      </Modal>

      <CustomCard
        className="center-contents text-center direction-column"
        style={{ position: "relative" }}
      >
        <div
          className="center-contents justify-flex-end"
          style={{
            width: "100%",
            position: "absolute",
            top: 0,
          }}
        >
          <button
            style={{
              margin: 20,
            }}
            type="button"
            onClick={() => setShowBalance(!showBalance)}
          >
            <AppIcon
              textColor="blue"
              render={!showBalance ? AiFillEye : AiFillEyeInvisible}
            />
          </button>
        </div>
        <Typography
          variant="subtitle"
          textColor="med-gray"
          content="Your Balance"
        />
        <Typography
          size={39}
          weight={500}
          textColor="blue"
          content={
            showBalance
              ? currencyFormat(profile?.walletBalance || 0)
              : "************"
          }
        />
      </CustomCard>
      <div className="center-contents space-between btn-section">
        <CustomButton text="Withdraw" secondary onClick={handleWithdraw} />
        <CustomButton onClick={handleAddFunds} text="Fund Wallet" />
      </div>
      <PaymentHistory>
        <Typography textColor="blue" content="Payment History" />
        <div>
          <TFilter
            active
            text="filter"
            renderSetVisible={({ setVisible }) => setVisible(false)}
          >
            <UlStyle onClick={onFilter}>
              {filterOptions?.map(({ label, value }) => (
                <li id={value} key={value}>
                  {label}
                </li>
              ))}
            </UlStyle>
          </TFilter>
        </div>
      </PaymentHistory>
      <TransactionList>
        {transactions?.map((item, i) => (
          <React.Fragment key={`${item.created_at}-${i.toString()}`}>
            <WalletCard
              action={item.transaction_type.name}
              name={item.transaction_source.name}
              id={item.reference}
              amount={item.amount}
              date={item.created_at}
            />
            <div ref={transactionRef} />
          </React.Fragment>
        ))}
        {transPaginationInfo.hasNext && (
          <TransactionSnippetLoader>
            <Loader open absolute />
          </TransactionSnippetLoader>
        )}
      </TransactionList>
      <Loader
        open={
          bankAccLoading ||
          profileLoading ||
          transactionsLoading ||
          isFetchingProfile ||
          isFetchingTransaction
        }
        absolute
      />
    </StyledDiv>
  );
};
