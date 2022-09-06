import React from "react";
import { Button, Card, Select, Typography } from "components";
import { Link } from "react-router-dom";
import { ROUTES } from "app-constants";
import { Loader } from "components/atoms/Loader";

const PlayPage = () => {
  return (
    <div>
      Play
      <div>
        <Card>
          <Typography>Welcome</Typography>
          <Button loading text="Hello" />
          <Select name="options" options={["a", "b", "c"]} />
        </Card>
      </div>
      <Typography.Heading>Hello</Typography.Heading>
      <Typography.Heading level={2}>Hello</Typography.Heading>
      <Typography.Heading level={4}>Hello</Typography.Heading>
      <Typography.Heading level={6}>Hello</Typography.Heading>
      <Typography>Hello</Typography>
      <Typography variant="bodyBig">Hello</Typography>
      <Typography variant="heading4">Heading 4</Typography>
      <Typography variant="heading4" textColor="blue" content="heading text" />
      <Typography variant="heading4" textColor="pink" content="heading next" />
      <Typography variant="heading4" textColor="med-gray" content="Heading 4" />
      <Button text="Next" />
      <Button secondary text="Next" />
      <Button secondary text="Other Page" />
      <Link to={ROUTES.other.fullPath}>Link to Other Page</Link>
      <div
        style={{
          position: "relative",
          width: 500,
          height: 600,
        }}
      >
        {/* Notice that this is wrapped within a relative element and the loader set as absolute */}
        <Loader open absolute />
      </div>
    </div>
  );
};

export default PlayPage;
