import React from "react";
import { Button, Typography } from "components";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "app-constants";
import { DashboardContent } from "layouts";

const NotFoundPage = () => {
  const navigator = useNavigate();

  return (
    <DashboardContent>
      <Typography.Heading>Not Found</Typography.Heading>
      <Typography.Heading level={2}>Not Found</Typography.Heading>
      <Typography>The page you are looking for can&apos;t be found</Typography>
      <div>
        <Button
          secondary
          text="go home"
          onClick={() => navigator(ROUTES.home.path)}
        />
        <Button text="go back" onClick={() => navigator(-1)} />
      </div>
    </DashboardContent>
  );
};

export default NotFoundPage;
