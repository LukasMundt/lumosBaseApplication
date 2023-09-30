import { Head, Link } from "@inertiajs/react";
import React, { useMemo, useState, useEffect } from "react";
// import Table from "./partials/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Badge,
    Breadcrumb,
    Button,
    Checkbox,
    Label,
    Table,
} from "flowbite-react";
import {
    ArrowPathIcon,
    EyeIcon,
    HomeIcon,
    PencilIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import PrimaryButton from "@/Components/PrimaryButton";
import DeleteModal from "@/Components/DeleteModal";
import PrimaryLinkButton from "@/Components/PrimaryLinkButton";

export default class Index extends React.Component {
    render() {
        const { auth } = this.props;

        console.log(this.props.users);

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div>
                        {/* <Breadcrumb aria-label="Default breadcrumb example">
                            <Breadcrumb.Item
                                // chevron="w-0"
                                role="root"
                                href="#"
                                icon={HomeIcon}
                            >
                                Home
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
                            <Breadcrumb.Item>Flowbite React</Breadcrumb.Item>
                        </Breadcrumb> */}
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
                                Nach gelöschten filtern
                            </Link>
                            <PrimaryLinkButton href={route("admin.users.create")}>
                                Nutzer erstellen
                            </PrimaryLinkButton>
                        </div>

                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            {/* <Table columns={columns} data={this.props.users} /> */}
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Rollen</Table.HeadCell>
                                    <Table.HeadCell>
                                        Mail-Adresse
                                    </Table.HeadCell>
                                    <Table.HeadCell>Status</Table.HeadCell>
                                    <Table.HeadCell>Erstellt am</Table.HeadCell>
                                    <Table.HeadCell>
                                        Erstellt von
                                    </Table.HeadCell>
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
                                                    {user.roles.map((role) => (
                                                        <Badge
                                                            color="gray"
                                                            className=""
                                                            key={role.id}
                                                        >
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.email}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.status}
                                            </Table.Cell>
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
                </div>
            </AuthenticatedLayout>
        );
    }
}
