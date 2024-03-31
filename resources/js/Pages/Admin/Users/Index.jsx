import { Head, Link } from "@inertiajs/react";
import React, { useMemo, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Table } from "flowbite-react";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowPathIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/Components/ui/button";

export default class Index extends React.Component {
    render() {
        const { auth } = this.props;

        // console.log(this.props.users);

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Benutzer
                        </h2>
                    </div>
                }
            >
                <Head title="Benutzer" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 text-gray-800 dark:text-gray-200">
                        <div className="w-full flex justify-between">
                            <Link
                                href={route("admin.users.index", {
                                    deletedUsers: true,
                                })}
                            >
                                Gelöschte anzeigen
                            </Link>
                            <Link href={route("admin.users.create")}>
                                <Button>Nutzer erstellen</Button>
                            </Link>
                        </div>

                        {/* <Table columns={columns} data={this.props.users} /> */}
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>#</Table.HeadCell>
                                <Table.HeadCell>Name</Table.HeadCell>
                                <Table.HeadCell>Teams</Table.HeadCell>
                                <Table.HeadCell>Mail-Adresse</Table.HeadCell>
                                <Table.HeadCell>Status</Table.HeadCell>
                                <Table.HeadCell>Erstellt am</Table.HeadCell>
                                <Table.HeadCell>Erstellt von</Table.HeadCell>
                            </Table.Head>
                            <Table.Body>
                                {this.props.users.map((user) => (
                                    <Table.Row
                                        key={user.id}
                                        className={
                                            user.deleted_at === null
                                                ? ""
                                                : "bg-red-950"
                                        }
                                    >
                                        <Table.Cell className="flex gap-2">
                                            <a
                                                href={route(
                                                    "admin.users.show",
                                                    {
                                                        user: user.id,
                                                    }
                                                )}
                                                hidden={
                                                    user.deleted_at !== null
                                                }
                                            >
                                                <EyeIcon className="w-5" />
                                            </a>
                                            <a
                                                href={route(
                                                    "admin.users.edit",
                                                    {
                                                        user: user.id,
                                                    }
                                                )}
                                                hidden={
                                                    user.deleted_at !== null
                                                }
                                            >
                                                <PencilSquareIcon className="w-5" />
                                            </a>

                                            {user.deleted_at === null ? (
                                                <Link
                                                    href={route(
                                                        "admin.users.delete",
                                                        { user: user.id }
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    type="button"
                                                    title="delete"
                                                >
                                                    <TrashIcon className="w-5 text-red-500" />
                                                </Link>
                                            ) : (
                                                <Link
                                                    // href={route(
                                                    //     "admin.users.restore",
                                                    //     { user: user.id }
                                                    // )}
                                                    // method="patch"
                                                    as="button"
                                                    type="button"
                                                    title="restore"
                                                >
                                                    <ArrowPathIcon className="w-5 text-gray-500 cursor-not-allowed" />
                                                </Link>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>{user.name}</Table.Cell>
                                        <Table.Cell>
                                            <div className="flex flex-wrap gap-2">
                                                {user.reduced_teams.map(
                                                    (team) => (
                                                        <Badge
                                                            variant="secondary"
                                                            key={team.id}
                                                        >
                                                            {team.name}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                        <Table.Cell>{user.status}</Table.Cell>
                                        <Table.Cell>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleString("de-DE")}
                                        </Table.Cell>
                                        <Table.Cell></Table.Cell>
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
