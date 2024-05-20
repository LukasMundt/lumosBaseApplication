import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import CreatePopup from "./CreatePopup";
import { CampaignsTable } from "./tableCampaigns";

export default function Index({ auth, domain, campaigns }) {
    // const toggleReload = () => {
    //     router.reload({ only: ["campaigns"] });
    // };
console.log(campaigns)
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
                {/* <ListsTable
                    data={lists}
                    buttons={
                        <CreatePopup
                            domain={domain}
                            toggleReload={toggleReload}
                        />
                    }
                    domain={domain}
                /> */}
                {/* <CreatePopup domain={domain} /> */}
                <CampaignsTable
                    data={campaigns}
                    buttons={<CreatePopup domain={domain} />}
                    domain={domain}
                />
            </div>
        </AuthenticatedLayout>
    );
}
