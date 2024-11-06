
import React from 'react';

function DataTable({ data }: { data: any[] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((val, i) => (
              <td key={i} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                {val}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
