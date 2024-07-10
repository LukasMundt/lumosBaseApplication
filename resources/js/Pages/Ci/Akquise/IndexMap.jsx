import { Head, router, usePage, useRemember } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MyMapMulti from "./partials/MyMapMulti";
import { useGeolocation } from "@uidotdev/usehooks";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { useState } from "react";
import { CreatePopup } from "./partials/CreatePopup";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";

export default function IndexMap({ domain }) {
    const { user, auth, markers } = usePage().props;
    const location = useGeolocation();
    const [creatorMode, setCreatorMode] = useRemember(false);
    const [selectedLocation, selectLocation] = useState(null);

    const handleCoordinatesClick = (lat, lng) => {
        // console.log(lat);
        selectLocation({ lat: lat, lon: lng });
    };

    const unselectLocation = () => {
        selectLocation(null);
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

            <div
                className="h-full flex flex-col"
                // style={{ height: bodyHeight - (headerHeight + navHeight + 1) + "px" }}
            >
                <div className="w-full flex justify-between items-center mb-2">
                    <div className="flex gap-3">
                        <Tabs
                            defaultValue="map"
                            className="w-[200px]"
                            onValueChange={(value) => {
                                if (value === "table") {
                                    router.visit(
                                        route("akquise.akquise.index", {
                                            domain: domain,
                                        })
                                    );
                                }
                            }}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="table">Tabelle</TabsTrigger>
                                <TabsTrigger value="map">Karte</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div>
                        <Switch
                            id="creator-mode"
                            checked={creatorMode}
                            aria-label="toggle creator mode"
                            onCheckedChange={(e) =>
                                setCreatorMode(!creatorMode)
                            }
                        ></Switch>
                        <Label htmlFor="creator-mode" className="ml-2">
                            Creator Mode
                        </Label>
                    </div>

                    <CreatePopup
                        openParam={selectedLocation != null}
                        unselectLocation={unselectLocation}
                        location={selectedLocation}
                    />
                </div>

                <div className="mx-auto space-y-6 w-full h-full">
                    <MyMapMulti
                        center={
                            location.loading || location.error
                                ? [53.55522722948935, 9.995317259820599]
                                : [location.latitude, location.longitude]
                        }
                        markers={markers}
                        zoom={18}
                        height={null}
                        getCoordinates={
                            creatorMode ? handleCoordinatesClick : null
                        }
                        locationLoaded={!location.loading && !location.error}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
