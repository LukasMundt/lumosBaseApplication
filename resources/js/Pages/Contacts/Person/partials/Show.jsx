import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { ContactTable } from "./tableContacts";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { PersonForm } from "./PersonForm";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Skeleton } from "@/Components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { MapPin, Pencil } from "lucide-react";
import PersonForm_Dialog from "./PersonForm_Dialog";

export default function Show({ domain, setPersonBreadcrumb = null }) {
    let location = useLocation();
    const [person, setPerson] = useState();
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openPersonEdit, setOpenPersonEdit] = useState(false);

    function triggerReload() {
        setLoaded(false);
    }

    useEffect(() => {
        if (!loaded && !loading) {
            axios
                .get(
                    route("api.v1.contacts.persons.show", {
                        domain: domain,
                        person: location.pathname.substring(1),
                    })
                )
                .then((response) => {
                    setPerson(response.data);
                    setLoading(false);
                    setLoaded(true);
                    setPersonBreadcrumb != null &&
                        setPersonBreadcrumb(response.data.name);
                })
                .catch((error) => {
                    if (error?.response?.status == 403) {
                        toast.error("Die Aktion ist nicht erlaubt.");
                    } else {
                        toast.error("Etwas ist schiefgelaufen.");
                    }
                });
        }
    }, [loaded, person]);

    console.log(person);
    return (
        <div className="flex gap-4">
            <div className="">
                <Card>
                    <CardHeader>
                        <div className="flex justify-end">
                            <Button
                                className=""
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() => setOpenPersonEdit(true)}
                            >
                                <Pencil />
                            </Button>
                            <PersonForm_Dialog
                                open={openPersonEdit}
                                onOpenChange={setOpenPersonEdit}
                                domain={domain}
                                submitButtonText={"Änderungen speichern"}
                                triggerReload={triggerReload}
                                personId={person?.id ?? null}
                                closeForm={setOpenPersonEdit}
                            />
                        </div>

                        <div className="flex justify-center">
                            {loading || !loaded ? (
                                <Skeleton className="w-32 h-32 rounded-full" />
                            ) : (
                                <div>
                                    <Avatar className="w-32 h-32 text-5xl">
                                        <AvatarFallback>
                                            {(person.prename === null
                                                ? ""
                                                : person.prename.substring(
                                                      0,
                                                      1
                                                  )) +
                                                (person.lastname === null
                                                    ? ""
                                                    : person.lastname.substring(
                                                          0,
                                                          1
                                                      ))}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {loading || !loaded ? (
                            <div className="grid gap-2">
                                <Skeleton className="w-32 h-6 rounded-full" />
                                <Skeleton className="w-32 h-6 rounded-full" />
                            </div>
                        ) : (
                            <Table>
                                <TableBody>
                                    {person.title && (
                                        <TableRow>
                                            <TableCell>Titel</TableCell>
                                            <TableCell>
                                                {person.title}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {person.prename && (
                                        <TableRow>
                                            <TableCell>Vorname</TableCell>
                                            <TableCell>
                                                {person.prename}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {person.additional_prenames && (
                                        <TableRow>
                                            <TableCell>
                                                weitere Vornamen
                                            </TableCell>
                                            <TableCell>
                                                {person.additional_prenames}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {person.lastname && (
                                        <TableRow>
                                            <TableCell>Nachname</TableCell>
                                            <TableCell>
                                                {person.lastname}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {person.gender && (
                                        <TableRow>
                                            <TableCell>Geschlecht</TableCell>
                                            <TableCell>
                                                {person.gender == "female"
                                                    ? "weiblich"
                                                    : person.gender == "male"
                                                    ? "männlich"
                                                    : person.gender == "diverse"
                                                    ? "divers"
                                                    : "unbekannt"}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                        {person?.address_id != null ? (
                            <div className="flex gap-3">
                                <div className="grid items-center">
                                    <MapPin />
                                </div>
                                <div className="grid">
                                    <span>
                                        {person?.address?.street +
                                            " " +
                                            person?.address?.housenumber}
                                    </span>
                                    <span>
                                        {person?.address?.zip_code +
                                            " " +
                                            person?.address?.city}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        <Table>
                            <TableBody>
                                {/* {person.email && (
                                    <TableRow>
                                        <TableCell>E-Mail</TableCell>
                                        <TableCell>{person.email}</TableCell>
                                    </TableRow>
                                )} */}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div></div>
        </div>
    );
}
