import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrganisationForm } from "./Person/partials/OrganisationForm";
import React from "react";
import ConnectDialog from "./Person/ConnectDialog";

export default function Dashboard({ auth }) {
    // console.log(usePage().props);
    const { str, domain } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                        <div>{str}</div>
                    </div>
                </div>
            </div>
            {/* <BrowserRouter>
                <Routes path="/personal">
                    <Route path="/personal/123" element={<div>routed Element</div>} />
                </Routes>
            </BrowserRouter> */}
            <ConnectDialog domain={domain} />
        </AuthenticatedLayout>
    );
}
