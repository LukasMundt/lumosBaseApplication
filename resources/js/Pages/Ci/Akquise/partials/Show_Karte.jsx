import { usePage } from "@inertiajs/react";
import { Alert } from "flowbite-react";

import MyMap from "./MyMap";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function Show_Karte({ className = "", lat = 0, lon = 0 }) {
    if (lat === 0 || lon === 0) {
        return (
            <Alert color="failure" icon={InformationCircleIcon}>
                Leider sind die gespeicherten Koordinaten nicht korrekt.
            </Alert>
        );
    }

    return (
        <section className={className}>
            <MyMap lat={lat} lon={lon} />
        </section>
    );
}
