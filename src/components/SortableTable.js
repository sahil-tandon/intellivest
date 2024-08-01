import React, { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function SortableTable({ columns, data, actions, renderExpandedRow }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    const column = columns.find((col) => col.key === sortConfig.key);
    return [...data].sort((a, b) => {
      const aValue = column.getValue ? column.getValue(a) : a[sortConfig.key];
      const bValue = column.getValue ? column.getValue(b) : b[sortConfig.key];

      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  const requestSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
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
    <table className="w-full text-sm text-left text-text-primary">
      <thead className="text-xs uppercase bg-card">
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.key}
              className="px-3 py-3 cursor-pointer"
              onClick={() => requestSort(column.key)}
            >
              <div
                className={`flex items-center ${
                  index === 0 ? "justify-start" : "justify-center"
                }`}
              >
                <span>{column.label}</span>
                <span className="ml-2">{getSortIcon(column.key)}</span>
              </div>
            </th>
          ))}
          {actions && <th className="px-3 py-3 text-center">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item) => (
          <React.Fragment key={item.id}>
            <tr className="bg-background border-b border-border">
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={`px-3 py-4 ${
                    index === 0 ? "text-left" : "text-center"
                  }`}
                >
                  {column.render
                    ? column.render(
                        column.getValue
                          ? column.getValue(item)
                          : item[column.key],
                        item
                      )
                    : item[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-3 py-4 text-center">{actions(item)}</td>
              )}
            </tr>
            {renderExpandedRow && renderExpandedRow(item)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}

export default SortableTable;
