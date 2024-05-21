import * as React from 'react';
import {keys, kebabCase} from "lodash-es"
import { GenericeRecord } from '../types';
import {useMemo} from "react";

export interface TableProps {
  id: string,
  headers: Record<string, string>;
  rows: GenericeRecord[];
  searchable?: {
    [name: string]: React.ReactNode;
  };
}

const TableComponent: React.FC<TableProps> = ({ id, searchable, headers, rows }) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {Object.keys(headers).map((header: string) => (
              <th id={"h-"+id+"-"+header} key={id+"-"+header} scope="col" className="px-6 py-3">
                {headers[header]}
                {searchable?.[header]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr id={"r-"+id+"-"+i}
                key={"r-"+id+"-"+i+"-"+row[keys(headers)[0]]} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              {keys(headers).map((header: string, i) =>
                i === 0 ? (
                  <th
                    id={"c-"+id+"-"+header}
                    key={"c-"+id+"-"+header}
                    scope="row"
                    className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row[header]}
                  </th>
                ) : (
                  <td key={"c-"+id+"-"+header} className="px-6 py-2">
                    {row[header]}
                  </td>
                ),
              )}
            </tr>
          ))}
          {!rows.length && (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th colSpan={6} className="py-6 text-center">
                No results found for this query.
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
