import React from "react";
import { Button, Card, Select, Typography } from "components";
import { TextArea } from "pages/ReportEmergencyPage/style";

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

        <Card>
          <Typography>Contact admin</Typography>
          <Typography.Heading textColor="blue">
            Got a problem? Send us a message immediately
          </Typography.Heading>
          <Typography>We’ll reply you as soon as possible.</Typography>
          <Select
            label="Complaints Category"
            options={[]}
            name="Complaints Category"
          />

          <TextArea
            placeholder="Describe your challenge here"
            name="description"
            rows={10}
          />
          <Button text="Send" />
        </Card>
      </div>
    </div>
  );
};

export default PlayPage;
