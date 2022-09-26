import React from "react";
import { useOnClickOutside } from "hooks";
import { Card, Typography } from "components/atoms";
import styled from "styled-components/macro";
import { BsBell, BsBellFill } from "react-icons/bs";
import { AppIcon, pxToEm } from "utils";
import { useQuery } from "@tanstack/react-query";
import { UlStyle } from "components";
import { hexToHSL } from "utils/helpers";
import {
  getAllNotifications,
  markAllNotificationAsRead,
  markNotificationAsRead,
} from "./request";

const Button = styled.button`
  all: unset;
  cursor: pointer;
  background-color: var(--gray-2);
  border-radius: 16px;
  padding: ${pxToEm(15)};
  position: relative;

  .red-dot {
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--pink);
    top: 7px;
    right: 7px;
  }

  :active {
    transform: scale(0.98);
  }
`;

const Drop = styled.div`
  z-index: 2;
  position: absolute;
  top: 65px;
  left: 0;
  min-width: 200px;

  > div {
    box-shadow: 2px 5px 10px 1px #00000026;
  }

  @media screen and (min-width: ${pxToEm(900, false)}) {
    right: 0;
    left: unset;
  }
`;

const Li = styled.li<{ read?: null | string }>`
  background-color: ${({ read }) => !read && hexToHSL("#3a86ff", 20)};

  @media screen and (min-width: ${pxToEm(900, false)}) {
    min-width: 400px;
  }
`;

export const NotificationDropdown = () => {
  const { ref, visible, setVisible } = useOnClickOutside(false);
  const { data, isLoading, refetch } = useQuery(
    [getAllNotifications.key],
    getAllNotifications,
    {
      // fetch every 30 mins
      refetchInterval: 60000 * 5,
    }
  );

  const onNotificationClick = (e: React.MouseEvent<any>) => {
    const id = (e.target as Record<string, any>)?.id;
    setVisible(!visible);
    (async () => {
      await markNotificationAsRead({ id });
      await refetch();
    })();
  };

  const markAllAsRead = () => {
    if (data?.length) {
      (async () => {
        await markAllNotificationAsRead();
        await refetch();
      })();
    }
  };

  const toggleDrop = () => {
    setVisible(!visible);
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <Button type="button" onClick={toggleDrop}>
        <AppIcon
          render={data?.length ? BsBellFill : BsBell}
          size={20}
          color="var(--blue)"
        />
        {!!data?.length && <span className="red-dot" />}
      </Button>
      {visible && (
        <Drop>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {isLoading ? (
              <div style={{ padding: 10 }}>
                <Typography content="Please Wait..." />
              </div>
            ) : (
              <div>
                <div>
                  <button
                    type="button"
                    style={{ padding: "20px 10px 10px", whiteSpace: "nowrap" }}
                    onClick={markAllAsRead}
                    disabled={!data?.length}
                  >
                    <Typography textColor={data?.length ? "blue" : "gray"}>
                      Clear all
                    </Typography>
                  </button>
                </div>
                <>
                  {!data?.length ? (
                    <div style={{ padding: 10 }}>
                      <Typography
                        textColor="blue"
                        variant="helperText"
                        content="No New Notifications"
                      />
                    </div>
                  ) : (
                    <UlStyle onClick={onNotificationClick}>
                      {data?.map((el, i) => (
                        <Li
                          key={el.id}
                          id={el.id}
                          style={{
                            borderBottom:
                              i !== data.length - 1
                                ? "1px solid var(--gray)"
                                : undefined,
                          }}
                          read={el.read_at}
                        >
                          {el?.message}
                        </Li>
                      ))}
                    </UlStyle>
                  )}
                </>
              </div>
            )}
          </Card>
        </Drop>
      )}
    </div>
  );
};
