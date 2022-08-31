import React from "react";
import { Select, Typography } from "components";
import { useQuery } from "@tanstack/react-query";
import { getLandlordsProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";

const HomePage = () => {
  const { isLoading } = useQuery(["getLandlordsProfile"], getLandlordsProfile);

  return (
    <div>
      <Loader open={isLoading} />
      <Typography>Welcome</Typography>
      <Select name="options" options={["a", "b", "c"]} />
    </div>
  );
};

export default HomePage;
