import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Show_Karte from "./partials/Show_Karte";
import { InformationCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Show_Status from "./partials/Show_Status";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    MinusCircleIcon,
} from "@heroicons/react/24/solid";
import Show_KartenModal from "./partials/Show_KartenModal";
import Drawer from "@/Components/Drawer";
import Form from "../../Notiz/Form";
import Show_Notizen from "../../Notiz/Show_Notizen";
import Show_Personen from "./partials/Show_Personen";
import NotizPopup from "@/Pages/Notiz/NotizPopup";
import ConnectDialog from "@/Pages/Person/ConnectDialog";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import Show_Campaigns from "./partials/Show_Campaigns";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";

export default class Show extends React.Component {
    render() {
        const { auth, projekt, notiz, domain, this_type } = this.props;
        // console.log(this.props);

        const contactDialog = ({ button = null }) => {
            return (
                <ConnectDialog
                    domain={domain}
                    thisModel={{
                        type: projekt.akquise.type,
                        id: projekt.id,
                    }}
                    button={button}
                    toggleReload={toggleReload}
                />
            );
        };

        const toggleReload = () => {
            router.reload({ only: ["projekt"] });
        };

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="w-full">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="./../">
                                        Projekte
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbPage>
                                    {projekt.address.street +
                                        " " +
                                        projekt.address.housenumber}
                                </BreadcrumbPage>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex justify-between w-full content-center">
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight align-middle">
                                {projekt.address.street +
                                    " " +
                                    projekt.address.housenumber}
                            </h2>
                            {contactDialog({
                                button: (
                                    <Button variant="outline">
                                        Person verknüpfen
                                    </Button>
                                ),
                            })}
                        </div>
                    </div>
                }
                className="sm:px-15"
            >
                <Head
                    title={
                        projekt.address.street +
                        " " +
                        projekt.address.housenumber +
                        " ansehen"
                    }
                />

                <div className="py-12">
                    <div className="mx-auto space-y-6">
                        <Show_Status status={projekt.akquise.status} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {/* generelle Informationen */}
                                <section>
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="p-4 bg-emerald-300 rounded-full"
                                            title="Standort"
                                        >
                                            <MapPinIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <Card>
                                        <CardContent className="grid grid-cols-2 gap-3 p-4">
                                            <div>Straße und Hausnummer</div>
                                            <div>
                                                {projekt.address.street +
                                                    " " +
                                                    projekt.address.housenumber}
                                            </div>
                                            <div>Postleitzahl</div>
                                            <div>
                                                {projekt.address.zip_code}
                                            </div>
                                            <div>Stadtteil</div>
                                            <div>
                                                {projekt.address.district ?? ""}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>
                                {/* Details Akquise */}
                                <section className="mt-12">
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="p-4 bg-emerald-300 rounded-full"
                                            title="Details"
                                        >
                                            <InformationCircleIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <Card>
                                        <CardContent className="grid grid-cols-2 p-4">
                                            <div className="content-center">
                                                Retour
                                            </div>
                                            <div>
                                                <BooleanShow
                                                    dataKey="retour"
                                                    expression={
                                                        projekt.akquise.retour
                                                    }
                                                    ifTrue={
                                                        <ExclamationCircleIcon className="w-6 text-yellow-300" />
                                                    }
                                                    ifFalse={
                                                        <MinusCircleIcon className="w-6 text-gray-400" />
                                                    }
                                                    domain={domain}
                                                    id={projekt.id}
                                                    toggleReload={toggleReload}
                                                />
                                            </div>
                                            <div className="content-center">
                                                Nicht gewünscht
                                            </div>
                                            <div>
                                                <BooleanShow
                                                    dataKey="nicht_gewuenscht"
                                                    expression={
                                                        projekt.akquise
                                                            .nicht_gewuenscht
                                                    }
                                                    ifTrue={
                                                        <ExclamationCircleIcon className="w-6 text-red-500" />
                                                    }
                                                    ifFalse={
                                                        <MinusCircleIcon className="w-6 text-gray-400" />
                                                    }
                                                    domain={domain}
                                                    id={projekt.id}
                                                    toggleReload={toggleReload}
                                                />
                                            </div>
                                            <div className="content-center">
                                                Teilung
                                            </div>
                                            <div>
                                                <BooleanShow
                                                    dataKey="teilung"
                                                    expression={
                                                        projekt.akquise.teilung
                                                    }
                                                    ifTrue={
                                                        <CheckCircleIcon className="w-6 text-green-500" />
                                                    }
                                                    ifFalse={
                                                        <MinusCircleIcon className="w-6 text-gray-400" />
                                                    }
                                                    domain={domain}
                                                    id={projekt.id}
                                                    toggleReload={toggleReload}
                                                />
                                            </div>
                                            <div className="content-center">
                                                Abriss
                                            </div>
                                            <div>
                                                <BooleanShow
                                                    dataKey="abriss"
                                                    expression={
                                                        projekt.akquise.abriss
                                                    }
                                                    ifTrue={
                                                        <CheckCircleIcon className="w-6 text-green-500" />
                                                    }
                                                    ifFalse={
                                                        <MinusCircleIcon className="w-6 text-gray-400" />
                                                    }
                                                    domain={domain}
                                                    id={projekt.id}
                                                    toggleReload={toggleReload}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </section>
                                <Show_Personen
                                    personen={projekt.akquise.personen}
                                    projektId={projekt.id}
                                    domain={domain}
                                    button={contactDialog({
                                        button: (
                                            <Button variant="outline">
                                                Person verknüpfen
                                            </Button>
                                        ),
                                    })}
                                    triggerReload={toggleReload}
                                />
                                <Show_Notizen
                                    notizen={projekt.akquise.notizen}
                                    button={
                                        <NotizPopup
                                            creationUrl={
                                                this.props.creationUrlNotes
                                            }
                                            toggleReload={toggleReload}
                                        />
                                    }
                                    projekt={projekt}
                                    domain={domain}
                                />
                            </div>
                            <div className="space-y-4">
                                <Show_Karte
                                    lat={projekt.address.lat}
                                    lon={projekt.address.lon}
                                />
                                <Show_KartenModal
                                    lat={projekt.address.lat}
                                    lon={projekt.address.lon}
                                />

                                <div className="">
                                    <Show_Campaigns
                                        campaigns={projekt.akquise.campaigns}
                                        domain={domain}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}

function BooleanShow({
    dataKey,
    expression,
    ifTrue,
    ifFalse,
    domain,
    id,
    toggleReload,
}) {
    const handleClick = () => {
        var data = {};
        data[dataKey] = !expression;
        // console.log(data);
        toast.promise(
            axios.post(
                route("api.v1.projects.akquise", {
                    domain: domain,
                    project: id,
                }),
                data
            ),
            {
                loading: "Wird gespeichert...",
                success: (response) => {
                    if (toggleReload != null) {
                        toggleReload();
                    }
                    return "Änderung gespeichert";
                },
                error: (error) => {
                    // console.log(error);
                    return "Fehler";
                },
            }
        );
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="p-0"
            onClick={handleClick}
        >
            {expression ? ifTrue : ifFalse}
        </Button>
    );
}
