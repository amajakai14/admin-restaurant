import type { Dispatch, SetStateAction } from "react";
import React from "react";
import Pagination from "react-paginate";
export type TPagination = {
  dataCount: number;
  perPage: number;
  setPage: Dispatch<SetStateAction<number>>;
};
const CustomPagination = (props: TPagination) => {
  function handlePageChange(page: { selected: number }) {
    props.setPage(page.selected + 1);
  }
  return (
    <Pagination
      pageCount={Math.ceil(props.dataCount / props.perPage)}
      onPageChange={handlePageChange}
      containerClassName="flex flex-row justify-between gap-1"
      activeClassName="active text-2xl"
      breakLabel="..."
    />
  );
};

export default CustomPagination;
