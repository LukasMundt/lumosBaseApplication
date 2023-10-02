import { Head, Link } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Table } from "flowbite-react";
import {
    ArrowPathIcon,
    EyeIcon,
    HomeIcon,
    PencilIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import PrimaryLinkButton from "@/Components/PrimaryLinkButton";

export default class Index extends React.Component {
    render() {
        const { auth, teams } = this.props;
        console.log(teams);

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Teams
                    </h2>
                }
            >
                <Head title="Teams" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 text-gray-800 dark:text-gray-200">
                        <div className="w-full flex justify-end">
                            <PrimaryLinkButton href={route("admin.teams.create")}>
                                Team erstellen
                            </PrimaryLinkButton>
                        </div>

                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>
                                        Beschreibung
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body>
                                    {teams.map((team) => (
                                        <Table.Row key={team.id}>
                                            <Table.Cell className="flex gap-2">
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
                                                        "admin.teams.edit",
                                                        {
                                                            team: team.id,
                                                        }
                                                    )}
                                                    // hidden={
                                                    //     role.deleted_at !== null
                                                    // }
                                                >
                                                    <PencilSquareIcon className="w-5" />
                                                </a>
                                                <Link
                                                    href={route(
                                                        "admin.teams.delete",
                                                        { team: team.id }
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    type="button"
                                                    title="delete"
                                                    hidden={team.id === 0}
                                                >
                                                    <TrashIcon className="w-5 text-red-500" />
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{team.name}</Table.Cell>
                                            <Table.Cell>{team.description}</Table.Cell>
                                            {/* <Table.Cell>
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
                                            </Table.Cell> */}
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
