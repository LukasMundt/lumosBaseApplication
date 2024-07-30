import { Head, Link, router } from "@inertiajs/react";
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
import UserTable from "./partials/Table";

export default class Index extends React.Component {
    render() {
        const { auth, domain } = this.props;

        const triggerReload = () => {
            router.reload({ only: ["users"] });
        };

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

                        <UserTable
                            triggerReload={triggerReload}
                            data={this.props.users}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
