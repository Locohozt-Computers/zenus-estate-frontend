import React, { useMemo, useState } from "react";
import { Typography, Card } from "components/atoms";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { DashboardContent } from "layouts";
import {
  paymentActions,
  paymentSelectors,
} from "store/reducers/payment/paymentSlice";
import { PaymentOptionNameEnum } from "api";
import { useQuery } from "@tanstack/react-query";
import { getPaymentMethod } from "pages/request";
import { AppIcon } from "utils";
import { IconArrowLeft } from "assets/icons";
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
  const [page, setPage] = useState(0);

  const { data: payMethods } = useQuery(["getPaymentMethod"], getPaymentMethod);

  const pId = useSelector(paymentSelectors.paymentMethodId);

  const dispatch = useDispatch();

  const { resetValues } = paymentActions;

  const payM = useMemo(
    () => payMethods?.find((el) => el.id === pId),
    [pId, payMethods]
  );

  const nav = (p: number) => {
    if (p === 1) {
      return "/payment methods";
    }
    if (p === 2 && payM?.name === PaymentOptionNameEnum.Wallet) {
      return "/wallet payment";
    }
    if (p === 2 && payM?.name === PaymentOptionNameEnum.Card) {
      return "/card payment";
    }
    if (p === 3) {
      return "/payment methods/successful";
    }
    if (p === 4) {
      return "/payment methods/failed";
    }
    return "";
  };

  const handleBackBtn = () => {
    if (page > 2) {
      dispatch(resetValues());
      setPage(0);
    } else setPage(page - 1);
  };

  return (
    <DashboardContent>
      <StyledDiv>
        <StyledCard>
          <div className="arrow-icon">
            <button
              type="button"
              onClick={handleBackBtn}
              style={{
                display: page < 1 ? "none" : "block",
                cursor: "pointer",
              }}
            >
              <AppIcon size={45} render={IconArrowLeft} />
            </button>
            <Typography
              size={16}
              weight={500}
              textColor="med-gray"
              content={page ? `Pay bills${nav(page)}` : ""}
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
              ][page]
            }
          </div>
        </StyledCard>
      </StyledDiv>
    </DashboardContent>
  );
};

export default InstantPayPage;
