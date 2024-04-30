import { usePage } from "@inertiajs/react";
import Notiz from "./partials/Notiz";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Card from "@/Components/Card";

export default function Show_Notizen({ notizen, button, domain, projekt }) {
    return (
        <section className="mt-12 space-y-4">
            <div className="flex justify-center">
                <div
                    className="p-4 bg-emerald-300 rounded-full"
                    title="Details"
                >
                    <PencilSquareIcon className="w-6 h-6" />
                </div>
            </div>
            <div className="flex justify-center">
                {/* <PrimaryLinkButton
      href={route("akquise.akquise.personen.associate", {
        projekt: projektId,
      })}
    >
      <LinkIcon className="w-4 mr-3"/> Person verknüpfen
    </PrimaryLinkButton> */}
                {button}
            </div>

            <Card directClassName="space-y-3">
                {notizen != null && notizen.length > 0 ? (
                    ""
                ) : (
                    <div>Hier wurden keine Notizen zugeordnet.</div>
                )}
                {notizen != null && notizen.length > 0
                    ? notizen.map((notiz) => (
                          <Notiz
                              notiz={notiz}
                              key={notiz.id}
                              projekt={projekt}
                              domain={domain}
                          />
                      ))
                    : ""}
            </Card>
        </section>
    );
}
