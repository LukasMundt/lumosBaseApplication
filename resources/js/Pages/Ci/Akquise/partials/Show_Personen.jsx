import PrimaryLinkButton from "@/Components/PrimaryLinkButton";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import {
    ArrowTopRightOnSquareIcon,
    LinkIcon,
    UserCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Show_Personen({
    personen = [],
    projektId,
    domain,
    button,
    triggerReload = null,
}) {
    return (
        <section className="mt-12 space-y-4">
            <div className="flex justify-center">
                <div
                    className="p-4 bg-emerald-300 rounded-full"
                    title="Details"
                >
                    <UserIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="flex justify-center">{button}</div>

            <Card>
                <CardContent className="p-4 grid gap-5 grid-cols-1 lg:grid-cols-2">
                    {personen.length === 0 ? (
                        <div>
                            Diesem Projekt sind keine Personen zugeordnet.
                        </div>
                    ) : (
                        ""
                    )}
                    {personen.map((contact, index) => {
                        return (
                            <PersonCard
                                domain={domain}
                                person={contact}
                                key={contact.id}
                                triggerReload={triggerReload}
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </section>
    );
}

function PersonCard({ person, domain, className = "", triggerReload = null}) {
    const handleDeconnect = () => {
        toast.promise(
            axios.post(route("api.v1.contacts.deconnect", { domain: domain }), {
                this_id: person.pivot.model_id,
                this_type: "App\\Models\\Ci\\Akquise",
                contact_id: person.id,
                contact_type: person.pivot.contact_type,
            }),
            {
                loading: "Wird entfernt...",
                success: () => {
                    triggerReload && triggerReload();
                    return "Erfolgreich entfernt.";
                },
                error: (error) => {
                    // console.log(error);
                    handleServerError(error);
                    if (error.response.status === 500) {
                        return "Interner Serverfehler";
                    }
                    return "Fehler";
                },
            }
        );
    };

    return (
        <div className={"flex space-x-3 justify-between " + className}>
            <div>
                <Avatar>
                    <AvatarFallback>
                        {(person.prename === null
                            ? ""
                            : person.prename.substring(0, 1)) +
                            (person.lastname === null
                                ? ""
                                : person.lastname.substring(0, 1))}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-grow">
                <div className="flex flex-wrap gap-x-3">
                    {(person.title === null ? "" : person.title + " ") +
                        (person.prename === null ? "" : person.prename + " ") +
                        (person.additional_prenames === null
                            ? ""
                            : person.additional_prenames + " ") +
                        (person.lastname === null ? "" : person.lastname)}
                    <Badge variant="secondary">{person.pivot.type}</Badge>
                </div>
                {person.telefonnummern.length === 0 ? (
                    ""
                ) : (
                    <div>
                        Tel:{" "}
                        {person.telefonnummern.map((nummer, index) => (
                            <>
                                <a
                                    href={"tel:" + nummer.telefonnummer}
                                    key={nummer.id}
                                >
                                    {nummer.telefonnummer}
                                </a>
                                {index + 1 === person.telefonnummern.length
                                    ? ""
                                    : ", "}
                            </>
                        ))}
                    </div>
                )}
                {person.email === null ? (
                    ""
                ) : (
                    <div>
                        E-Mail:{" "}
                        <a href={"mailto:" + person.email}>{person.email}</a>
                    </div>
                )}
            </div>
            <div>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => handleDeconnect()}
                >
                    <Trash2 size={20} className="text-red-500" />
                </Button>
                {/* <Button
                    color="gray"
                    href={route("projectci.person.show", {
                        person: person.id,
                        domain: domain,
                    })}
                >
                    <ArrowTopRightOnSquareIcon className="w-5" />
                </Button> */}
            </div>
        </div>
    );
}
