import styled from "styled-components";
import React, { useMemo } from "react";
import { AppIcon, pxToEm } from "utils";
import { IconArrowLeft } from "assets/icons";

interface NavI {
  /**
   * Pages Must be ordered
   */
  pages: Array<string | null | undefined | boolean>;
  active: number;
  onPageChange?: (page: number) => void;
}

const NavStyle = styled.div`
  display: flex;
  align-items: center;

  > button {
    margin-right: 10px;
    cursor: pointer;
  }
  .pagination {
    color: var(--med-gray);
    display: flex;
    align-items: center;
    gap: 1px;
    font-size: clamp(${pxToEm(12)}, 4vw, ${pxToEm(16)});
  }
`;

const Btn = styled.button`
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;

  .active {
    color: var(--black);
  }
`;

export const NavigationController = ({ pages, active, onPageChange }: NavI) => {
  const cpyPages = useMemo(
    () =>
      pages.filter(Boolean).reduce((acc, el, i) => {
        if (active - 1 === i) {
          acc.push(
            <Btn id={i.toString()}>
              <span className="active" id={i.toString()}>
                {el}
              </span>
            </Btn>
          );
        } else {
          acc.push(<Btn id={i.toString()}>{el}</Btn>);
        }
        acc.push(<span>/</span>);
        return acc;
      }, [] as any[]),
    [active, pages]
  );

  const handleClick = (e: any) => {
    const id = e.target.id;
    if (id && onPageChange) onPageChange(+id + 1);
  };

  const handleGoBack = () => {
    if (onPageChange) {
      onPageChange(active - 1 !== 0 ? active - 1 : 1);
    }
  };

  return (
    <NavStyle>
      {active - 1 !== 0 && (
        <button type="button" onClick={handleGoBack}>
          <AppIcon size={45} render={IconArrowLeft} />
        </button>
      )}
      <div role="presentation" className="pagination" onClick={handleClick}>
        {cpyPages.slice(0, active * 2 - 1).map((el, i) => (
          <React.Fragment key={`${i.toString()}`}>{el}</React.Fragment>
        ))}
      </div>
    </NavStyle>
  );
};
