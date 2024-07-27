import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

function SortableTable({ columns, data, sortConfig, onSort, actions }) {
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
                onClick={() => onSort(column.key)}
              >
                {column.label} {getSortIcon(column.key)}
              </th>
            ))}
            {actions && <th className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-background border-b border-border">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SortableTable;
