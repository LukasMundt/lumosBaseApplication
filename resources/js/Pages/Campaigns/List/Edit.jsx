import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

export default function Index({ auth, domain, list }) {
    const toggleReload = () => {
        router.reload({ only: ["list"] });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {list.name}
                </h2>
            }
        >
            <Head title="Übersicht" />

            <div className="">
                {/* TODO: Bearbeitung einer Liste muss hier möglich gemacht werden */}
                Die Bearbeitung der Liste ist aktuell nicht möglich.
            </div>
        </AuthenticatedLayout>
    );
}
