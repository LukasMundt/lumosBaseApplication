import React from "react";
import {
    // createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

export default function Table({ columns, data }) {
    // const table = useReactTable({ columns, data });
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

    // const {
    //     getTableProps, // table props from react-table
    //     getTableBodyProps, // table body props from react-table
    //     headerGroups, // headerGroups, if your table has groupings
    //     rows, // rows for the table based on the data passed
    //     prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    // } = useTable({
    //     columns,
    //     users,
    // });

    /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
    console.log(table.getAllColumns());
    return (
        <table className="text-gray-200">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            {/* <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot> */}
        </table>
    );
}
