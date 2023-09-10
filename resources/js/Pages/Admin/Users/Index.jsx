import { Head, Link } from "@inertiajs/react";
import React, { useMemo, useState, useEffect } from "react";
// import Table from "./partials/Table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Breadcrumb, Button, Checkbox, Label, Table } from "flowbite-react";
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

export default class Index extends React.Component {
    render() {
        const { auth } = this.props;

        console.log(this.props.users);

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <Breadcrumb aria-label="Default breadcrumb example">
                        <Breadcrumb.Item role="root" href="#" icon={HomeIcon}>
                            <p>Home</p>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Projects</Breadcrumb.Item>
                        <Breadcrumb.Item>Flowbite React</Breadcrumb.Item>
                    </Breadcrumb>
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
                            <PrimaryButton href={route("admin.users.create")}>
                                Nutzer erstellen
                            </PrimaryButton>
                        </div>

                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                            {/* <Table columns={columns} data={this.props.users} /> */}
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>#</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
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
                                                    hidden={user.deleted_at !== null}
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
                                                    hidden={user.deleted_at !== null}
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
                                                        href={route(
                                                            "admin.users.restore",
                                                            { user: user.id }
                                                        )}
                                                        method="get"
                                                        as="button"
                                                        type="button"
                                                        title="restore"
                                                    >
                                                        <ArrowPathIcon className="w-5 text-green-500" />
                                                    </Link>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell>{user.name}</Table.Cell>
                                            <Table.Cell>
                                                {user.email}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.status}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {user.created_at}
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
