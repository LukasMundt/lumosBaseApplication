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
import { DataTablePagination } from "../../../Components/datatable/Pagination";
import moment from "moment";
import "moment/locale/de";
import { Pencil, Send } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { toast } from "sonner";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

export default function CampaignsTable({
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
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [campaignToDelete, setCampaignToDelete] = React.useState(null);

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

    const duplicateCampaign = (campaignId) => {
        toast.promise(
            axios.post(
                route("api.v1.campaigns.campaigns.replicate", {
                    domain: domain,
                    campaign: campaignId,
                })
            ),
            {
                loading: "Wird dupliziert...",
                success: () => {
                    triggerReload();
                    return "Duplikat erstellt.";
                },
                error: (error) => {
                    console.log(error);
                    if (error.response.status === 500) {
                        return "Interner Serverfehler";
                    }
                    return "Fehler";
                },
            }
        );
    };

    const deleteCampaign = () => {
        campaignToDelete &&
            toast.promise(
                axios.delete(
                    route("api.v1.campaigns.campaigns.delete", {
                        domain: domain,
                        campaign: campaignToDelete,
                    })
                ),
                {
                    loading: "Wird gelöscht...",
                    success: () => {
                        triggerReload();
                        return "Erfolgreich in den Papierkorb verschoben.";
                    },
                    error: (error) => {
                        if (error.response.status === 500) {
                            return "Interner Serverfehler";
                        } else if (error.response.status === 405) {
                            return error.response.data.message ?? "Fehler";
                        }
                        return "Fehler";
                    },
                }
            );
    };

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
                                href={route("campaigns.campaigns.edit", {
                                    domain: domain,
                                    campaign: row.original.id,
                                })}
                                className="cursor-pointer"
                            >
                                <DropdownMenuItem className="cursor-pointer">
                                    Bearbeiten
                                </DropdownMenuItem>
                            </a>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                type="button"
                                onClick={() =>
                                    duplicateCampaign(row.original.id)
                                }
                            >
                                Duplizieren
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                // type="button"
                                onClick={() => {
                                    setDeleteOpen(true);
                                    setCampaignToDelete(row.original.id);
                                }}
                                disabled={row.original.sent_at != null}
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
            accessorKey: "sent_at",
            id: "Status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Status
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="px-4">
                    {row.original.sent_at != null ? (
                        <Send size={20} color="green" />
                    ) : (
                        <Pencil size={20} />
                    )}
                </div>
            ),
        },
        {
            enableHiding: false,
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Name
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                console.log(row.original);
                return (
                    <div className="">
                        <a
                            href={route("campaigns.campaigns.edit", {
                                domain: domain,
                                campaign: row.original.id,
                            })}
                        >
                            <Button variant="link">
                                {row.getValue("name")}
                            </Button>
                        </a>
                    </div>
                );
            },
        },
        {
            accessorKey: "list_id",
            id: "Liste",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Liste
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) =>
                row.orignial?.address_list ? (
                    <div className="">
                        <a
                            href={route("campaigns.lists.edit", {
                                domain: domain,
                                list: row.original.list_id,
                            })}
                        >
                            <Button variant="link">-</Button>
                        </a>
                    </div>
                ) : (
                    <div>-</div>
                ),
        },
        {
            accessorKey: "updated_at",
            id: "Letze Änderung",
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
                <div className="px-4">
                    {moment(row.original.updated_at).locale("de").fromNow()}
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
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Bist du dir wirklich sicher?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Möchtest du die Kampagne wirklich in den Papierkorb
                            verschieben?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction
                            type="button"
                            onClick={() => deleteCampaign()}
                        >
                            Verschieben
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex items-center py-4">
                {/* <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
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
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
