import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface SpreadsheetViewerProps {
  fileUrl: string;
}

interface SheetData {
  name: string;
  data: any[][];
}

const SpreadsheetViewer: React.FC<SpreadsheetViewerProps> = ({ fileUrl }) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);

  useEffect(() => {
    fetch(fileUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetsData = workbook.SheetNames.map((name) => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 }),
        }));
        setSheets(sheetsData);
      })
      .catch((error) => console.error('Error loading spreadsheet:', error));
  }, [fileUrl]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow p-4">
      <Tabs>
        <TabList>
          {sheets.map((sheet, index) => (
            <Tab key={index}>{sheet.name}</Tab>
          ))}
        </TabList>

        {sheets.map((sheet, index) => (
          <TabPanel key={index}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  {sheet.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell: any, cellIndex: number) => (
                        <td
                          key={cellIndex}
                          className="px-3 py-2 border border-gray-200 text-sm"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default SpreadsheetViewer;