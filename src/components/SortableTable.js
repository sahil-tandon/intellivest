import React, { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function SortableTable({ columns, data, actions, renderExpandedRow }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          ...prevConfig,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    }
    return <FaSort />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-text-primary">
        <thead className="text-xs uppercase bg-card">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 cursor-pointer"
                onClick={() => requestSort(column.key)}
              >
                {column.label} {getSortIcon(column.key)}
              </th>
            ))}
            {actions && <th className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <React.Fragment key={item.id}>
              <tr className="bg-background border-b border-border">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 ${column.className || ""}`}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {actions && <td className="px-6 py-4">{actions(item)}</td>}
              </tr>
              {renderExpandedRow && renderExpandedRow(item)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;
