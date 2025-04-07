import { useEffect, useState } from "react";
import {
  getOpenTenderNoticesFromDB,
  TenderNoticeInterface
} from "../../api/api";

export function App() {
  const [tableData, setTableData] = useState<TenderNoticeInterface[]>([]);

  useEffect(() => {
    const getOpenTenderNoticesData = async () => {
      setTableData(await getOpenTenderNoticesFromDB());
    };
    getOpenTenderNoticesData();
  }, []);

  const TenderTable = ({ data }: { data: any[] }) => {
    const headers = Object.keys(data[0] || {});

    return (
      // Responsive container
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {headers.map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 px-4 py-2 align-top">
                    {/* Wrapping text in a container that can scroll vertically if needed */}
                    <div className="max-h-16 overflow-y-auto break-words">
                      {row[header]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4">
      {tableData && tableData.length > 0 ? (
        <TenderTable data={tableData} />
      ) : (
        <p className="text-gray-600">No data found.</p>
      )}
    </div>
  );
}

export default App;
