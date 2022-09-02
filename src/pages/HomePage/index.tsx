import React from "react";
import { Button, Card, Select, Typography } from "components";
import { useQuery } from "@tanstack/react-query";
import { getLandlordsProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";
import { DashboardContent } from "layouts";
import { HomeHeader } from "pages/HomePage/Header";

const HomePage = () => {
  const { isLoading } = useQuery(["getLandlordsProfile"], getLandlordsProfile);

  return (
    <>
      <Loader absolute open={isLoading} />
      <HomeHeader />
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
