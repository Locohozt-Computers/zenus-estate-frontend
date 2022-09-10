import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "pages/request";
import { Loader } from "components/atoms/Loader";

const AccountStatementPage = () => {
  const { isLoading, data } = useQuery(
    ["getAllTransactions"],
    getAllTransactions
  );

  return (
    <div>
      <Loader open={isLoading} />
      {JSON.stringify(data)}
    </div>
  );
};

export default AccountStatementPage;
