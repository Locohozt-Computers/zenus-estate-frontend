import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Balanceimg from "assets/images/balanceimg.png";
import { Button, Card, Modal, TFilter, Typography } from "components";
import { WalletCard } from "components/molecules/WalletCard";
import { pxToEm } from "utils";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getWalletTransactions } from "pages/request";
import { currencyFormat } from "utils/helpers";
import { Loader } from "components/atoms/Loader";
import { PropsI } from "pages/WalletPage/types";
import { TransactionTypeEnum } from "api";
import { getBankAccounts } from "pages/WalletPage/request";
import { FundWallet } from "pages/WalletPage/FundWallet";
import { notification } from "services";
import { useScrollWithin } from "hooks";

const StyledDiv = styled.div`
  position: relative;

  .btn-section {
    margin-bottom: ${pxToEm(40)};
    gap: 15px;
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

const UlStyle = styled.ul`
  list-style: none;
  white-space: nowrap;

  > li {
    padding: 10px 15px;

    :hover {
      color: white;
      cursor: pointer;
      background-color: var(--blue);
    }
  }
`;

const CustomCard = styled(Card)`
  background: url(${Balanceimg});
  height: 243px;
  margin-bottom: 65px;
`;

const CustomButton = styled(Button)`
  width: 100%;
`;

const filterOptions = [
  { label: "All", value: "null" },
  { label: "Credit", value: TransactionTypeEnum.Credit },
  { label: "Debit", value: TransactionTypeEnum.Debit },
];

export const WalletOverview = ({ setPage }: PropsI) => {
  const [withdrawState, setWithdrawState] = useState<
    "no-funds" | "no-account" | null
  >(null);

  const [filterTransactionsId, setFilterTransactionsId] = useState("");

  const [transPaginationInfo, setTransPaginationInfo] = useState({
    current: 1,
    perPage: 10,
    total: 0,
    hasNext: "" as string | null,
  });

  const {
    data: transactions,
    isLoading: transactionsLoading,
    refetch: refetchTransaction,
    isFetching: isFetchingTransaction,
  } = useQuery(
    ["getWalletTransactions", filterTransactionsId],
    getWalletTransactions
  );

  const transactionPagination = useCallback(() => {
    if (transPaginationInfo.hasNext) {
      // do something
    }
  }, [transPaginationInfo.hasNext]);

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
    const id = (event.target as any)?.id;
    if (id) {
      // Todo: implement param filter
      setFilterTransactionsId(id as string);
    }
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
    if (transactions && !isFetchingTransaction) {
      setTransPaginationInfo({
        perPage: transactions?.per_page,
        current: transactions.current_page,
        total: transactions.total,
        hasNext: transactions.next_page_url,
      });
    }
  }, [isFetchingTransaction, transactions]);

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

      <CustomCard className="center-contents text-center direction-column">
        <Typography
          variant="subtitle"
          textColor="med-gray"
          content="Your Balance"
        />
        <Typography
          size={39}
          weight={500}
          textColor="blue"
          content={currencyFormat(profile?.walletBalance || 0)}
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
              {filterOptions.map(({ label, value }) => (
                <li id={value} key={value}>
                  {label}
                </li>
              ))}
            </UlStyle>
          </TFilter>
        </div>
      </PaymentHistory>
      <TransactionList ref={transactionRef}>
        {transactions?.data?.map((item) => (
          <div ref={transactionRef}>
            <WalletCard
              key={item.id}
              action={item.transaction_type.name}
              name={item.transaction_source.name}
              id={item.reference}
              amount={item.amount}
              date={item.created_at}
            />
          </div>
        ))}
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
