import React from "react";
import { Button, Card, Select, Typography } from "components";

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
    </div>
  );
};

export default PlayPage;
