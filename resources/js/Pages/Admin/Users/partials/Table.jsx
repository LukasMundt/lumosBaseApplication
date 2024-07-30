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
    DropdownMenuSeparator,
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
import { Badge } from "@/Components/ui/badge";
import moment from "moment";
import { Link } from "@inertiajs/react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function UserTable({ triggerReload, data }) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const isSmallDevice = useMediaQuery("only screen and (max-width : 907px)");
    const [filters, setFilters] = React.useState({});

    function setFilterForColumn(column, filterValue) {
        table.getColumn(column)?.setFilterValue(filterValue);
    }

    function deleteUser(id) {
        toast.promise(
            axios.delete(
                route("admin.users.delete", {
                    user: id,
                })
            ),
            {
                loading: "Wird gelöscht...",
                success: () => {
                    triggerReload && triggerReload();
                    return "Erfolgreich gelöscht.";
                },
                error: (error) => {
                    handleServerError(error);
                    if (error.response.status === 500) {
                        return "Interner Serverfehler";
                    }
                    return "Fehler";
                },
            }
        );
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

                            <a
                                href={route("admin.users.show", {
                                    user: row.original.id,
                                })}
                                className="cursor-pointer"
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Ansehen
                                </DropdownMenuItem>
                            </a>
                            <a
                                href={route("admin.users.edit", {
                                    user: row.original.id,
                                })}
                                className="cursor-pointer"
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Bearbeiten
                                </DropdownMenuItem>
                            </a>

                            {/* <button
                                type="button"
                                onClick={() => deleteUser(row.original.id)}
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    <div className="flex">
                                        <TrashIcon className="w-5 text-red-500" />{" "}
                                        Löschen
                                    </div>
                                </DropdownMenuItem>
                            </button> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "name",
            enableHiding: false,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
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
                <div className="font-medium pl-4">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "teams",
            enableHiding: true,
            header: ({ column }) => (
                <div className="flex">
                    {/* <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        // disabled
                    > */}
                    Teams
                    {/* <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button> */}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex gap-2 flex-wrap">
                    {row.original.reduced_teams.map((team) => (
                        <Badge variant="secondary" key={team.id}>
                            {team.name}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "email",
            enableHiding: false,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Mail-Adresse
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
                <div className="font-medium pl-4">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "status",
            enableHiding: true,
            header: ({ column }) => (
                <div className="flex">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Status
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
                <div className="font-medium pl-4">{row.getValue("status")}</div>
            ),
        },
        {
            accessorKey: "created_at",
            id: "Erstellt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Erstellt
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div
                    className="px-4"
                    title={new Date(row.original.created_at).toLocaleString(
                        "de-DE"
                    )}
                >
                    {moment(row.original.created_at).locale("de").fromNow()}
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
            <div className="flex items-center py-4">
                {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns?.length}
                                    className="h-24 text-center"
                                >
                                    Keine Ergebnisse.
                                </TableCell>
                            </TableRow>
                        )}
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
