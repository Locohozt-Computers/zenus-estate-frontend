import React from "react";
import { Button, Card, Select, Typography } from "components";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { HomeHeader } from "pages/HomePage/Header";

const HomePage = () => {
  const { isLoading, data } = useQuery(["getUserProfile"], getUserProfile);

  return (
    <>
      <Loader absolute open={isLoading} />
      <HomeHeader
        name={
          (data?.data?.data.tenant_name ||
            data?.data?.data.landlord_name) as string
        }
      />
      <DashboardContent>
        <Card>
          <Typography>Welcome</Typography>
          <Button loading text="Hello" />
          <Select name="options" options={["a", "b", "c"]} />
        </Card>
      </DashboardContent>
    </>
  );
};

export default HomePage;
