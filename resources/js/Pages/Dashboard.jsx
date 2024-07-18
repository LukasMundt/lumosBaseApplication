import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import React from "react";

export default function Dashboard({ auth, team}) {
    // console.log(usePage().props);
    const { str, domain } = usePage().props;
console.log(team);
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
                            {"Team: "+team.name}
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
        </AuthenticatedLayout>
    );
}
