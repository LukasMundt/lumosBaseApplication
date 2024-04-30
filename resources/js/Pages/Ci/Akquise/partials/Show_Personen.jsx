import PrimaryLinkButton from "@/Components/PrimaryLinkButton";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import {
    ArrowTopRightOnSquareIcon,
    LinkIcon,
    UserCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "flowbite-react";

export default function Show_Personen({
    personen = [],
    projektId,
    domain,
    button,
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
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </section>
    );
}

function PersonCard({ person, domain, className = "" }) {
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
