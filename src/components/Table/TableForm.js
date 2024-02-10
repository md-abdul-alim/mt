import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";

export const TableForm = ({
  emptyMessage = "",
  tableColumns,
  data,
  setData,
  selectedData,
  setSelectedData,
  loading = true,
  dataKey,
  actionButton,
  dialog,
  isColor,
  actionButtonWidth = 2,
  body,
  autoLayout = true,
  actionHeader,
  sticky,
  ...rest
}) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (typeof data === "undefined" || data === null) {
      return setTableData([]);
    }
    setTableData(data);
  }, [data]);

  const columns = tableColumns?.map((col) => ({ name: col.field, label: col.header }));

  const options = {
    responsive: "scroll",
    selectableRows: "none",
    pagination: false,
    ...rest,
  };

  return (
    <div className={`p-grid table table2 ${sticky && "sticky"}`}>
      <div className="p-col-12">
        <MUIDataTable
          title={null}
          data={tableData}
          columns={columns}
          options={options}
          loading={loading}
          emptyRowsView={{
            message: loading ? (
              <div style={{ textAlign: "center" }}>Loading...</div>
            ) : (
              <div style={{ textAlign: "center" }}>{emptyMessage}</div>
            ),
          }}
          components={{
            TableBody: body,
          }}
        />
      </div>
    </div>
  );
};
