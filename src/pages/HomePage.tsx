import React from "react";
import { Button, Select, Typography } from "components";
import { useQuery } from "@tanstack/react-query";
import { getLandlordsProfile } from "pages/request";
import { Loader } from "components/atoms/Loader";

const HomePage = () => {
  const { isLoading } = useQuery(["getLandlordsProfile"], getLandlordsProfile);

  return (
    <>
      <Loader absolute open={isLoading} />
      <Typography>Welcome</Typography>
      <Button loading text="Hello" />
      <Select name="options" options={["a", "b", "c"]} />
    </>
  );
};

export default HomePage;
