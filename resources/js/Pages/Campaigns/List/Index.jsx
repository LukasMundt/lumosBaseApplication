import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import CreatePopup from "./CreatePopup";
import { ListsTable } from "./tableLists";

export default function Index({ auth, domain, lists }) {
    const toggleReload = () => {
        router.reload({ only: ["lists"] });
    };

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
                <ListsTable
                    data={lists}
                    buttons={
                        <CreatePopup
                            domain={domain}
                            toggleReload={toggleReload}
                        />
                    }
                    domain={domain}
                />
            </div>
        </AuthenticatedLayout>
    );
}
