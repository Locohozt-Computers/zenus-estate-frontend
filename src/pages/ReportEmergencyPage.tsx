import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllEmergency } from "pages/request";
import { Loader } from "components/atoms/Loader";

const ReportEmergencyPage = () => {
  const { isLoading } = useQuery(["getAllEmergency"], getAllEmergency);

  return (
    <div>
      <Loader open={isLoading} />
      <div>data</div>
    </div>
  );
};

export default ReportEmergencyPage;
