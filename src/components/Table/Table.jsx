import "./Table.css";

export const Table = ({ data, headers }) => {
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
            <tr key={index}>
              {headers.map((header) => (
                <td key={header.key}>{row[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
