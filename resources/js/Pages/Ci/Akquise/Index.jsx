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
import ProjectsTable from "./partials/Index_tableProjects";

export default function Index({}) {
    const { user, auth, domain, search, projects } = usePage().props;

    const triggerReload = () => {
        router.reload();
    };

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
            <div className="">
                <div className=" space-y-6">
                    <div className=" grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* <div className="row-span-2 space-y-4">
              <Index_Search className="flex-none" />
              <Index_Filter />
            </div> */}

                        <div className="lg:col-span-4">
                            <div className="flex justify-between col-span-1 lg:col-span-4">
                                {/* <form method="get" className="flex gap-2">
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
                                </form> */}

                                {/* <SimplePagination pagination={projekte}/> */}
                            </div>
                            <ProjectsTable
                                data={projects}
                                domain={domain}
                                buttons={
                                    <>
                                        <a
                                            href={route(
                                                "akquise.akquise.create",
                                                {
                                                    domain: domain,
                                                }
                                            )}
                                        >
                                            <Button>
                                                <PlusIcon className="w-6" />
                                                Projekt erstellen
                                            </Button>
                                        </a>
                                    </>
                                }
                                triggerReload={triggerReload}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
