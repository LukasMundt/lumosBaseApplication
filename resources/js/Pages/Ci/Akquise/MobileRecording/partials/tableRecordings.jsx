import * as React from "react";
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useMediaQuery } from "@uidotdev/usehooks";
import { DataTablePagination } from "@/Components/datatable/Pagination";
import { Link } from "react-router-dom";
import LoadingIcon from "@/Components/LoadingIcon";

export function RecordingTable({
    domain,
    buttons,
    triggerReload,
    data,
    loading,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const isSmallDevice = useMediaQuery("only screen and (max-width : 907px)");
    const [filters, setFilters] = React.useState({});
    const [editPerson, setEditPerson] = React.useState(null);

    function setFilterForColumn(column, filterValue) {
        table.getColumn(column)?.setFilterValue(filterValue);
    }

    React.useEffect(() => {
        if (isSmallDevice) {
            // var newVisibilities = colum;
            table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    column.toggleVisibility(false);
                });
        } else {
            table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                    column.toggleVisibility(true);
                });
        }
    }, [isSmallDevice]);

    const columns = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aktionen</DropdownMenuLabel>

                            <Link
                                to={"/recordings/" + row.original.id}
                                reloadDocument={false}
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Ansehen
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },

        {
            accessorKey: "created_at",
            enableHiding: false,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Titel
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                    {/* <Filter_Popup
                      filters={filters}
                      setFilters={setFilters}
                      column="Straße"
                      setFilterForColumn={setFilterForColumn}
                  /> */}
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-4">
                    <Link to={"/recordings/" + row.original.id}>
                        Aufnahme vom{" "}
                        {new Date(
                            row.getValue("created_at")
                        ).toLocaleDateString() +
                            " " +
                            new Date(
                                row.getValue("created_at")
                            ).toLocaleTimeString()}
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: "transferred",
            enableHiding: false,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Übertragen
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                    {/* <Filter_Popup
                      filters={filters}
                      setFilters={setFilters}
                      column="Straße"
                      setFilterForColumn={setFilterForColumn}
                  /> */}
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-4">
                    {row.getValue("transferred")}
                </div>
            ),
        },
        {
            accessorKey: "distance",
            enableHiding: false,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Zurückgelegte Strecke
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                    {/* <Filter_Popup
                    filters={filters}
                    setFilters={setFilters}
                    column="Straße"
                    setFilterForColumn={setFilterForColumn}
                /> */}
                </div>
            ),
            cell: ({ row }) => (
                <div className="font-medium pl-4">
                    {row.getValue("distance")}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            {/* <Dialog
                open={editPerson != null}
                onOpenChange={(open) => !open && setEditPerson(null)}
            >
                <DialogContent>
                    <DialogHeader>Person bearbeiten</DialogHeader>
                    <div>
                        <PersonForm
                            domain={domain}
                            submitButtonText={"Änderungen speichern"}
                            triggerReload={triggerReload}
                            personId={editPerson}
                            closeForm={(open) => !open && setEditPerson(null)}
                        />
                    </div>
                </DialogContent>
            </Dialog> */}
            {/* <PersonForm_Dialog
                open={editPerson != null}
                onOpenChange={(open) => !open && setEditPerson(null)}
                domain={domain}
                submitButtonText={"Änderungen speichern"}
                triggerReload={triggerReload}
                personId={editPerson}
                closeForm={(open) => !open && setEditPerson(null)}
            /> */}
            <div className="flex items-center py-4">
                {buttons}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Spalten <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : !loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns?.length}
                                    className="h-24 text-center"
                                >
                                    Keine Ergebnisse.
                                </TableCell>
                            </TableRow>
                        ) : null}
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns?.length}
                                    className="h-24 text-center flex justify-center items-center"
                                >
                                    <LoadingIcon />
                                </TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <DataTablePagination
                    table={table}
                    isSmallDevice={isSmallDevice}
                />
            </div>
        </div>
    );
}
