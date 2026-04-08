import { useRef } from "react";
import "./Table.css";

export const Table = ({ data, headers, onDoubleClick }) => {
  const clickTimeoutRef = useRef(null);
  const clickCountRef = useRef(0);

  const handleClick = (row, event) => {
    event.stopPropagation();

    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        // Это был одиночный клик
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      // Это двойной клик
      clearTimeout(clickTimeoutRef.current);
      clickCountRef.current = 0;
      if (onDoubleClick) {
        onDoubleClick(row);
      }
    }
  };

  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={(e) => handleClick(row, e)}
              style={{
                cursor: onDoubleClick ? "pointer" : "default",
                userSelect: "none",
              }}
            >
              {headers.map((header) =>
                header.render ? (
                  <td key={header.key}>{header.render(row)}</td>
                ) : (
                  <td key={header.key}>{row[header.key]}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
