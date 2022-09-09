import React from "react";
import { Card, Typography } from "components";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { HomeHeader } from "pages/HomePage/Header";
import { format } from "date-fns";

const HomePage = () => {
  const { isLoading, data } = useQuery(["getDashboard"], getDashboard);

  return (
    <>
      <HomeHeader />
      <DashboardContent>
        <Loader absolute open={isLoading} />
        <Card>
          <div>
            {data?.balances.map((t) => (
              <div>
                <Typography>{t.special_name}</Typography>
                <Typography>{t.user_levy_outstanding_balance}</Typography>
              </div>
            ))}
          </div>
          <br />
          <div>
            {data?.payment_history.map((t) => (
              <div style={{ marginBottom: 10 }}>
                <Typography>{t.levy.special_name}</Typography>
                <Typography>
                  {format(new Date(t.created_at), "do MMMM, yyyy")}
                </Typography>
                <Typography>{t.amount}</Typography>
                <Typography>{t.transaction_status.name}</Typography>
              </div>
            ))}
          </div>
        </Card>
      </DashboardContent>
    </>
  );
};

export default HomePage;
