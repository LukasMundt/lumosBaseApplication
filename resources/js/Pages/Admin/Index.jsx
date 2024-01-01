import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default class Index extends React.Component {
    render() {
        const { auth } = this.props;
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Admin-Dashboard
                    </h2>
                }
            >
                <Head title="Admin-Dashboard" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow sm:rounded-lg">
                            Diese Seite ist das Admin-Dashboard! Hier werden mal
                            Karten angeordnet! Man kann weiter zu den Usern,
                            Rollen und den Teams.
                            <br />
                            <br />
                            <Link href={route("admin.users.index")}>
                                Users-Index
                            </Link>
                            <br />
                            <br />
                            <Link href={route("admin.roles.index")}>
                                Roles-Index
                            </Link>
                            <br />
                            <br />
                            <Link href={route("admin.teams.index")}>
                                Teams-Index
                            </Link>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
