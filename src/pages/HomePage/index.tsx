import React from "react";
import { Card } from "components";
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
      <HomeHeader name={(data?.tenant_name || data?.landlord_name) as string} />
      <DashboardContent>
        <Card>content</Card>
      </DashboardContent>
    </>
  );
};

export default HomePage;
