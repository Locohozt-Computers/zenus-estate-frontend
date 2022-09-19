import React, { useMemo, useState } from "react";
import { Card } from "components/atoms";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { DashboardContent } from "layouts";
import {
  paymentActions,
  paymentSelectors,
} from "store/reducers/payment/paymentSlice";
import { useQuery } from "@tanstack/react-query";
import { getPaymentMethod, getPaymentType } from "pages/request";
import { NavigationController } from "components";
import { InstantForm } from "./InstantForm";
import { PayOption } from "./PayOption";
import { PaySummary } from "./PaySummary";
import { PaySuccess } from "./PaySuccess";
import { PayFailed } from "./PayFailed";

const StyledCard = styled(Card)`
  max-width: 804px;
  max-height: 757px;
  width: 100%;
  padding: 60px;

  .nav {
    margin-bottom: 30px;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 40px);

  .arrow-icon {
    display: flex;
    align-items: center;
    margin-bottom: 50px;
    gap: 16px;
  }

  .paymentDetails {
    align-self: center;
    height: 100%;
    padding: 0 40px;
  }
`;

const InstantPayPage = () => {
  const [page, setPage] = useState(1);

  const { data: payMethods } = useQuery(["getPaymentMethod"], getPaymentMethod);
  const { refetch } = useQuery(["paymentType"], getPaymentType);

  const pId = useSelector(paymentSelectors.paymentMethodId);

  const dispatch = useDispatch();

  const { resetValues } = paymentActions;

  const payM = useMemo(
    () => payMethods?.find((el) => el.id === pId),
    [pId, payMethods]
  );

  const handleBackBtn = (p: number) => {
    setPage(p);
    if (page > 3) {
      dispatch(resetValues());
      setPage(1);
      refetch();
    } else setPage(p);
  };

  return (
    <DashboardContent>
      <StyledDiv>
        <StyledCard>
          <div className="nav">
            <NavigationController
              pages={[
                "Pay Bills",
                "Payment Methods",
                `Make ${payM?.name} Payment`,
                page !== 5 && "Successful",
                "Failed",
              ]}
              active={page}
              onPageChange={handleBackBtn}
            />
          </div>
          <div className="paymentDetails">
            {
              [
                <InstantForm page={page} setPage={setPage} />,
                <PayOption page={page} setPage={setPage} />,
                <PaySummary page={page} setPage={setPage} />,
                <PaySuccess />,
                <PayFailed />,
              ][page - 1]
            }
          </div>
        </StyledCard>
      </StyledDiv>
    </DashboardContent>
  );
};

export default InstantPayPage;
