import React from "react";
import TableHeaders from "./TableHeaders";
import TableBody from "./TableBody";

const Table = props => {
  const { columns, onSort, sortColumn, data } = props;
  return (
    <table className="table">
      <TableHeaders columns={columns} onSort={onSort} sortColumn={sortColumn} />
      <TableBody data={data} columns={columns} />
    </table>
  );
};

export default Table;
