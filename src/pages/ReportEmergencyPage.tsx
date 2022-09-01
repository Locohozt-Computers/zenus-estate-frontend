import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllEmergency } from "pages/request";
import { Loader } from "components/atoms/Loader";

const ReportEmergencyPage = () => {
  const { isLoading } = useQuery(["getAllEmergency"], getAllEmergency);

  return (
    <>
      <Loader absolute fill open={isLoading} />
      <div>data</div>
    </>
  );
};

export default ReportEmergencyPage;
