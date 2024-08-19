import { Head, router, usePage, useRemember } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MyMapMulti from "../../partials/MyMapMulti";
import { useState } from "react";
import { CreatePopup } from "../../partials/CreatePopup";

export default function CreateMap({ domain, locations, center }) {
    const { user, auth } = usePage().props;
    const [selectedLocation, selectLocation] = useState(null);

    const handleCoordinatesClick = (lat, lng) => {
        selectLocation({ lat: lat, lon: lng });
    };

    const unselectLocation = () => {
        selectLocation(null);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="w-full flex justify-between items-center mb-2">
                <CreatePopup
                    openParam={selectedLocation != null}
                    unselectLocation={unselectLocation}
                    location={selectedLocation}
                />
            </div>

            <div className="mx-auto space-y-6 w-full h-full">
                <MyMapMulti
                    center={center}
                    // markers={[]}
                    // currentLocation={
                    //     location.loading || location.error
                    //         ? null
                    //         : {
                    //               lat: location.latitude,
                    //               lon: location.longitude,
                    //           }
                    // }
                    zoom={18}
                    height={null}
                    getCoordinates={handleCoordinatesClick}
                    locationLoaded={!location.loading && !location.error}
                    paths={[{ name: "Dein Pfad", positions: locations }]}
                />
            </div>
        </div>
    );
}
