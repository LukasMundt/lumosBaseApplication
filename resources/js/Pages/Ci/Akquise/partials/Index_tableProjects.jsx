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
import moment from "moment";
import "moment/locale/de";
import { Filter, Pencil, Send, X } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { toast } from "sonner";
import axios from "axios";
import { DataTablePagination } from "@/Components/datatable/Pagination";
import { Input } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Badge } from "@/Components/ui/badge";

export default function ProjectsTable({
    data,
    buttons,
    domain,
    triggerReload,
}) {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const isSmallDevice = useMediaQuery("only screen and (max-width : 907px)");
    const [filters, setFilters] = React.useState({});

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

    // const duplicateCampaign = (campaignId) => {
    //     toast.promise(
    //         axios.post(
    //             route("api.v1.campaigns.campaigns.replicate", {
    //                 domain: domain,
    //                 campaign: campaignId,
    //             })
    //         ),
    //         {
    //             loading: "Wird dupliziert...",
    //             success: () => {
    //                 triggerReload();
    //                 return "Duplikat erstellt.";
    //             },
    //             error: (error) => {
    //                 console.log(error);
    //                 if (error.response.status === 500) {
    //                     return "Interner Serverfehler";
    //                 }
    //                 return "Fehler";
    //             },
    //         }
    //     );
    // };

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
                            <DropdownMenuSeparator />
                            <a
                                href={route("akquise.akquise.show", {
                                    domain: domain,
                                    projekt: row.original.id,
                                })}
                                className="cursor-pointer"
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Ansehen
                                </DropdownMenuItem>
                            </a>
                            {/* <DropdownMenuItem
                                className="cursor-pointer"
                                type="button"
                                onClick={() =>
                                    duplicateCampaign(row.original.id)
                                }
                                disabled
                            >
                                Duplizieren
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                className="cursor-pointer"
                                // type="button"
                                // onClick={() =>
                                //     duplicateCampaign(row.original.id)
                                // }
                                // TODO: Projekt löschen können
                                disabled
                            >
                                Löschen
                            </DropdownMenuItem>

                            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "address.street",
            id: "Straße",
            enableHiding: false,
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Straße
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <Filter_Popup
                            filters={filters}
                            setFilters={setFilters}
                            column="Straße"
                            setFilterForColumn={setFilterForColumn}
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <a
                    href={route("akquise.akquise.show", {
                        domain: domain,
                        projekt: row.original.id,
                    })}
                    target="_self"
                >
                    <Button variant="link">
                        {row.original.address.street}
                    </Button>
                </a>
            ),
        },
        {
            accessorKey: "address.housenumber",
            id: "Hausnummber",
            enableHiding: false,
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {isSmallDevice ? "Nr" : "Hausnummer"}
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">{row.original.address.housenumber}</div>
            ),
        },
        {
            accessorKey: "address.zip_code",
            id: "Postleitzahl",
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            PLZ
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <Filter_Popup
                            filters={filters}
                            setFilters={setFilters}
                            column="Postleitzahl"
                            setFilterForColumn={setFilterForColumn}
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">{row.original.address.zip_code}</div>
            ),
        },
        {
            accessorKey: "address.district",
            id: "Stadtteil",
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Stadtteil
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <Filter_Popup
                            filters={filters}
                            setFilters={setFilters}
                            column="Stadtteil"
                            setFilterForColumn={setFilterForColumn}
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">{row.original.address.district}</div>
            ),
        },
        {
            accessorKey: "updated_at",
            id: "Letzte Änderung",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Letzte Änderung
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">
                    {moment(row.original.updated_at).locale("de").fromNow()}
                </div>
            ),
        },
        {
            accessorKey: "akquise.status",
            id: "Status",
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Status
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <Filter_Popup
                            filters={filters}
                            setFilters={setFilters}
                            column="Status"
                            setFilterForColumn={setFilterForColumn}
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">{row.original.akquise.status}</div>
            ),
        },
        {
            accessorKey: "akquise.personen_count",
            id: "Personen",
            header: ({ column }) => {
                return (
                    <div className="flex">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc"
                                )
                            }
                        >
                            Personen
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                        <Filter_Popup
                            filters={filters}
                            setFilters={setFilters}
                            column="Personen"
                            setFilterForColumn={setFilterForColumn}
                        />
                    </div>
                );
            },
            cell: ({ row }) => (
                <div className="pl-4">
                    {row.original.akquise.personen_count}
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
            <div className="flex items-center mb-4">
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
            <div className="flex gap-3 mb-3">
                {table.getAllColumns().map((col) =>
                    col.getIsFiltered() ? (
                        <div>
                            <Badge className="flex gap-2">
                                {col.columnDef.id + ": " + col.getFilterValue()}
                                <Button
                                    variant="destructive"
                                    className="h-5 w-5"
                                    size="icon"
                                    type="button"
                                    onClick={(e) => col.setFilterValue("")}
                                >
                                    <X />
                                </Button>
                                {/* <button className="w-3 hover:bg-destructive hover:text-white">X</button> */}
                            </Badge>
                        </div>
                    ) : (
                        ""
                    )
                )}
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
                                    colSpan={columns.length}
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

function Filter_Popup({ column, filters, setFilters, setFilterForColumn }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Filter width={20} />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <Input
                        placeholder="Filter streets..."
                        defaultValue={filters[column] ?? ""}
                        // value={filters["Straße"] ?? ""}
                        onChange={(event) => {
                            const temp = filters;
                            temp[column] = event.target.value;
                            setFilters(temp);
                            // console.log(temp);
                        }}
                        onKeyPress={(e) => {
                            if (e.code === "Enter") {
                                setFilterForColumn(column, filters[column]);
                            }
                        }}
                        className="max-w-sm"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
