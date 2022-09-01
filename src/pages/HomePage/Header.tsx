import styled from "styled-components/macro";
import { Card, NotificationDropdown, Typography } from "components";
import { formatNameToDisplay } from "utils/helpers";
import React, { ChangeEvent } from "react";
import { MdLocationPin } from "react-icons/md";

const HeaderStyles = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 40px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 40px;
`;

const SearchStyle = styled.div`
  position: relative;
  > svg {
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    left: 25px;
  }
  > input {
    border-radius: 8px;
    border: 1px solid var(--gray-3);
    padding: 18px 20px 18px 50px;
    font-size: 16px;
    width: 100%;
    outline: none;

    &:hover {
      border: 1px solid var(--light-blue);
    }
    &:focus {
      border: 1px solid var(--blue);
    }
  }
`;

const Search = ({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <SearchStyle>
      <MdLocationPin size={20} color="var(--blue)" />
      <input
        name="search"
        onChange={onChange}
        type="search"
        placeholder="12 Idumota Housing Estate, Lekki."
      />
    </SearchStyle>
  );
};

export const HomeHeader = () => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <HeaderStyles>
        <div>
          <Typography variant="heading4">
            Welcome Back, {formatNameToDisplay("Daniel")}
          </Typography>
          <Typography variant="bodyBig">
            Keep your environment clean, stay safe. 😷
          </Typography>
        </div>
        <Search onChange={() => {}} />
        <div>
          <NotificationDropdown />
          <div>profile logo</div>
        </div>
      </HeaderStyles>
    </Card>
  );
};
