import React from "react";
import { Button, Typography } from "components";
import { Loader } from "components/atoms/Loader";

function App() {
  return (
    <div className="App">
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
      <Button secondary text="Next" />
      <div
        style={{
          position: "relative",
          width: 500,
          height: 600,
        }}
      >
        <Loader open absolute />
      </div>
    </div>
  );
}

export default App;
