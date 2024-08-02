import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { ContactTable } from "./partials/tableContacts";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { PersonForm } from "./partials/PersonForm";
import {
    BrowserRouter,
    Link,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Show from "./partials/Show";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { useEffect, useState } from "react";

export default function Index({ auth, domain, persons }) {
    const [personBreadcrumb, setPersonBreadcrumb] = useState(null);
    const triggerReload = () => {
        router.reload({ only: ["persons"] });
    };

    return (
        <BrowserRouter basename={"/" + domain + "/contacts/persons"}>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="grid gap-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("team.dashboard", {
                                            domain: domain,
                                        })}
                                    >
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/">Personen</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {personBreadcrumb != null ? (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbPage>
                                            {personBreadcrumb ?? ""}
                                        </BreadcrumbPage>
                                    </>
                                ) : (
                                    ""
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Übersicht
                        </h2>
                    </div>
                }
            >
                <Head title="Übersicht" />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Main
                                domain={domain}
                                persons={persons}
                                triggerReload={triggerReload}
                                setPersonBreadcrumb={setPersonBreadcrumb}
                            />
                        }
                    />
                    <Route
                        path="/*"
                        element={
                            <Show
                                domain={domain}
                                setPersonBreadcrumb={setPersonBreadcrumb}
                            />
                        }
                    />
                </Routes>
            </AuthenticatedLayout>
        </BrowserRouter>
    );
}

function Main({ domain, persons, triggerReload, setPersonBreadcrumb = null }) {
    let location = useLocation();

    useEffect(() => {
        if (location.pathname == "/") {
            setPersonBreadcrumb != null && setPersonBreadcrumb(null);
        }
    }, [location]);

    return (
        <div className="">
            <div className=" space-y-6">
                <ContactTable
                    domain={domain}
                    data={persons}
                    triggerReload={triggerReload}
                    buttons={
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    Person erstellen
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogHeader>
                                        Person erstellen
                                    </DialogHeader>
                                </DialogHeader>
                                <div>
                                    <PersonForm
                                        domain={domain}
                                        triggerReload={triggerReload}
                                        submitButtonText="Erstellen"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    }
                />
            </div>
        </div>
    );
}
