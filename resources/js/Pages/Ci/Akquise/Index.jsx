import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Table } from "flowbite-react";
import Checkbox from "@/Components/Inputs/Checkbox";
import { PlusIcon } from "@heroicons/react/24/outline";
import Index_Search from "./partials/Index_Search";
import Pagination from "@/Components/Pagination";
import Index_Filter from "./partials/Index_Filter";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";

export default function Index({}) {
    const { user, auth, projekte, domain, search } = usePage().props;

    // console.log(usePage().props);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Übersicht
                </h2>
            }
        >
            <Head title="Übersicht" />
            <Tabs
                defaultValue="table"
                className="w-[200px]"
                onValueChange={(value) => {
                    if (value === "map") {
                        router.visit(
                            route("akquise.akquise.map", { domain: domain })
                        );
                    }
                }}
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="table">Tabelle</TabsTrigger>
                    <TabsTrigger value="map">Karte</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="py-5">
                <div className=" space-y-6">
                    <div className=" grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* <div className="row-span-2 space-y-4">
              <Index_Search className="flex-none" />
              <Index_Filter />
            </div> */}

                        <div className="lg:col-span-4">
                            <div className="flex justify-between col-span-1 lg:col-span-4 mb-4">
                                <form method="get" className="flex gap-2">
                                    <Label
                                        htmlFor="search"
                                        className="cursor-pointer content-center"
                                    >
                                        <Search />
                                    </Label>

                                    <Input
                                        name="search"
                                        id="search"
                                        title="Suchen"
                                        placeholder="Suchen..."
                                        defaultValue={search}
                                    ></Input>
                                </form>
                                <a
                                    href={route("akquise.akquise.create", {
                                        domain: domain,
                                    })}
                                >
                                    <Button>
                                        <PlusIcon className="w-6 me-2" />
                                        Projekt erstellen
                                    </Button>
                                </a>
                                {/* <SimplePagination pagination={projekte}/> */}
                            </div>
                            <Table striped>
                                <Table.Head>
                                    <Table.HeadCell>#</Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}
                                            Straße
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Hausnummer
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}PLZ{/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Stadtteil
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Personen
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Status{/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Anmerkungen
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                    <Table.HeadCell>
                                        <div className="flex justify-between">
                                            {/* <Link> */}Maßnahmen
                                            {/* </Link> */}
                                            <div>
                                                {/* <BarsArrowDownIcon className="w-4" /> */}
                                            </div>
                                        </div>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {projekte.data.length == 0 ? (
                                        <Table.Row>
                                            <Table.Cell
                                                colSpan={9}
                                                className="text-center"
                                            >
                                                Keine Ergebnisse gefunden.
                                            </Table.Cell>
                                        </Table.Row>
                                    ) : (
                                        projekte.data.map((projekt) => (
                                            <Table.Row
                                                key={projekt.id}
                                                className={
                                                    (projekt.nicht_gewuenscht
                                                        ? "odd:bg-red-400 even:bg-red-300 odd:dark:bg-red-950 even:dark:bg-red-800 "
                                                        : "") +
                                                    (projekt.retour
                                                        ? "odd:bg-yellow-400 even:bg-yellow-300 odd:dark:bg-yellow-950 even:dark:bg-yellow-800"
                                                        : "")
                                                }
                                            >
                                                <Table.Cell>
                                                    <Checkbox />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Link
                                                        href={route(
                                                            "akquise.akquise.show",
                                                            {
                                                                projekt:
                                                                    projekt.id,
                                                                domain: domain,
                                                            }
                                                        )}
                                                    >
                                                        {projekt.address
                                                            .street ?? ""}
                                                    </Link>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        projekt.address
                                                            .housenumber
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {projekt.address.zip_code}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {projekt.address.district ??
                                                        ""}
                                                </Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                        ))
                                    )}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                    <Pagination
                        current_page={projekte.current_page}
                        last_page={projekte.last_page}
                        params={{ domain: domain }}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
