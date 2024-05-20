import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ auth, domain}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Übersicht
                </h2>
            }
        >
            <Head title="Übersicht" />

            <div className="">
                <div className=" space-y-6">
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
