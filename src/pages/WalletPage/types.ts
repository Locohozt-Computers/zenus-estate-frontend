import React from "react";

export interface PropsI {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
