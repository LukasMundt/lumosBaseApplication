import { Head, Link } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Table,
} from "flowbite-react";
import { Badge } from "@/Components/ui/badge";
import {
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import PrimaryLinkButton from "@/Components/PrimaryLinkButton";

export default class Index extends React.Component {
    render() {
        const { auth, roles } = this.props;

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Rollen
                    </h2>
                }
            >
                <Head title="Rollen" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 text-gray-800 dark:text-gray-200">
                        <div className="w-full flex justify-end">
                            <PrimaryLinkButton
                                href={route("admin.roles.create")}
                            >
                                Rolle erstellen
                            </PrimaryLinkButton>
                        </div>

                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>#</Table.HeadCell>
                                    <Table.HeadCell>Bezeichnung</Table.HeadCell>
                                    <Table.HeadCell>
                                        Berechtigungen
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y divide-gray-700">
                                    {roles.map((role) => (
                                        <Table.Row
                                            key={role.id}
                                            className="bg-white  dark:bg-gray-800"
                                        >
                                            <Table.Cell>
                                                <div className="flex gap-2">
                                                    {/* <a
                                                    href={route(
                                                        "admin.roles.show",
                                                        {
                                                            role: role.id,
                                                        }
                                                    )}
                                                    // hidden={
                                                    //     role.deleted_at !== null
                                                    // }
                                                >
                                                    <EyeIcon className="w-5" />
                                                </a> */}
                                                    <a
                                                        href={route(
                                                            "admin.roles.edit",
                                                            {
                                                                role: role.id,
                                                            }
                                                        )}
                                                        // hidden={
                                                        //     role.deleted_at !== null
                                                        // }
                                                        title="edit"
                                                    >
                                                        <PencilSquareIcon className="w-5" />
                                                    </a>
                                                    <Link
                                                        href={route(
                                                            "admin.roles.delete",
                                                            { role: role.id }
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        type="button"
                                                        title="delete"
                                                        hidden={!role.deletable}
                                                    >
                                                        <TrashIcon className="w-5 text-red-500" />
                                                    </Link>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.name}
                                                    {role.name.indexOf(
                                                        "team-"
                                                    ) === 0 &&
                                                    role.team_id === 0 ? (
                                                        <Badge variant="secondary">
                                                            Team-Vorlage
                                                        </Badge>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </Table.Cell>
                                            {/* <Table.Cell>{role.team}</Table.Cell> */}
                                            <Table.Cell>
                                                <ul>
                                                    {role.permissions.length >
                                                    0 ? (
                                                        role.permissions.map(
                                                            (permission) => (
                                                                <li
                                                                    className="list-disc"
                                                                    key={
                                                                        permission.name
                                                                    }
                                                                >
                                                                    {
                                                                        permission.name
                                                                    }
                                                                </li>
                                                            )
                                                        )
                                                    ) : (
                                                        <></>
                                                    )}
                                                </ul>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
