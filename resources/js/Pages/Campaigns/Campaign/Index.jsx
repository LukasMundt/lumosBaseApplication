import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import CreatePopup from "./CreatePopup";
import CampaignsTable from "./tableCampaigns";

export default function Index({ auth, domain, campaigns }) {
    const triggerReload = () => {
        router.reload();
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
                <CampaignsTable
                    data={campaigns}
                    buttons={
                        <>
                            <CreatePopup domain={domain} />
                        </>
                    }
                    domain={domain}
                    triggerReload={triggerReload}
                />
            </div>
        </AuthenticatedLayout>
    );
}
