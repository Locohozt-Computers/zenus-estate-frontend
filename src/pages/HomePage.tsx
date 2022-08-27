import React from "react";
import { Typography } from "components";
import { Link } from "react-router-dom";
import { ROUTES } from "app-constants";

const HomePage = () => {
  return (
    <div>
      <Typography>Route Sample</Typography>
      <Link to={ROUTES.login.fullPath}>Login</Link>
      <br />
      <Link to={ROUTES.other.fullPath}>Other</Link>
    </div>
  );
};

export default HomePage;
