import { Head } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CreateForm from "./partials/CreateForm";
import { Card, CardContent } from "@/Components/ui/card";

export default class Create extends React.Component {
    render() {
        const { auth } = this.props;

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Erstellen
                    </h2>
                }
            >
                <Head title="Benutzer" />

                <div className="">
                    {/* <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow sm:rounded-lg"> */}
                    <Card>
                        <CardContent>
                            <CreateForm />
                        </CardContent>
                    </Card>
                    {/* </div>
                    </div> */}
                </div>
            </AuthenticatedLayout>
        );
    }
}
