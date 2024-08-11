import { Card } from "@/Components/ui/card";
import { MegaphoneIcon } from "@heroicons/react/24/outline";

export default function Show_Campaigns({ campaigns, domain }) {
    // console.log(campaigns);
    return (
        <section className="mt-12 space-y-4">
            <div className="flex justify-center">
                <div
                    className="p-4 bg-emerald-300 rounded-full"
                    title="Kampagne"
                >
                    <MegaphoneIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="grid gap-2">
                {campaigns.map((campaign) => (
                    <a
                        href={route("campaigns.campaigns.edit", {
                            campaign: campaign.id,
                            domain: domain,
                        })}
                    >
                        <Card className="p-2 grid">
                            {campaign.name}
                            <span>versendet am {campaign.sent_at}</span>
                        </Card>
                    </a>
                ))}
            </div>
        </section>
    );
}
