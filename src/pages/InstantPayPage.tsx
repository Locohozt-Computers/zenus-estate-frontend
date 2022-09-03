import React, { useState } from "react";
import { InstantForm } from "components/organisms/InstantPayments";
import { PayOption } from "components/organisms/InstantPayments/payOption";
import styled from "styled-components";
import { Typography } from "components";
import Icon from "assets/images/arrowright.png";

const StyledDiv = styled.div`
  padding: 47px 60px;
  border-radius: 16px;
  width: 804px;
  height: 757px;
  background-color: var(--white);
  margin: 0 auto;

  .arrow-icon {
    display: flex;
  }
`;

const InstantPayPage = () => {
  const [page, setPage] = useState(0);
  return (
    <StyledDiv>
      <span className="arrow-icon">
        <img src={Icon} alt="arrow" style={{ margin: " 0 1rem 0 -1rem" }} />
        <Typography
          size={16}
          weight={500}
          textColor="med-gray"
          content=" Pay bills"
        />
      </span>
      {page === 0 && <InstantForm page={page} setPage={setPage} />}
      {page === 1 && <PayOption page={page} setPage={setPage} />}
    </StyledDiv>
  );
};

export default InstantPayPage;
