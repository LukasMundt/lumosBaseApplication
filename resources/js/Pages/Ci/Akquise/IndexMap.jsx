import { Head, router, usePage, useRemember } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MyMapMulti from "./partials/MyMapMulti";
import { useGeolocation } from "@uidotdev/usehooks";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { useEffect, useState } from "react";
import { CreatePopup } from "./partials/CreatePopup";
import { Tabs, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";

export default function IndexMap({ domain }) {
    const { user, auth, markers, centerAdr } = usePage().props;
    const location = useGeolocation();
    const [center, setCenter] = useState({
        latitude: 53.55522722948935,
        longitude: 9.995317259820599,
    });
    const [creatorMode, setCreatorMode] = useRemember(false);
    const [selectedLocation, selectLocation] = useState(null);
    const [search, setSearch] = useState("");
    const [centerChanged, setCenterChanged] = useState(false);

    useEffect(() => {
        if (search == "") {
            const newCenter =
                location.loading || location.error
                    ? {
                          latitude: 53.55522722948935,
                          longitude: 9.995317259820599,
                      }
                    : {
                          latitude: location.latitude,
                          longitude: location.longitude,
                      };
            if (newCenter != center) {
                setCenterChanged(true);
            }
            setCenter(newCenter);
        } else if (center != centerAdr) {
            setCenter(centerAdr);
            setCenterChanged(true);
        }
    }, [location, search, centerAdr]);

    const handleCoordinatesClick = (lat, lng) => {
        selectLocation({ lat: lat, lon: lng });
    };

    const unselectLocation = () => {
        selectLocation(null);
    };

    function handleSearch() {
        router.visit(
            route("akquise.akquise.map", {
                domain: domain,
                search: search,
            }),
            { preserveState: true }
        );
    }

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
                        <Input
                            id="search"
                            onKeyDown={(e) => {
                                if (e.code === "Enter") {
                                    handleSearch();
                                }
                            }}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button
                            size="icon"
                            type="button"
                            onClick={handleSearch}
                            title="Search"
                        >
                            <Search width={40}/>
                        </Button>
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
                        center={[center.latitude, center.longitude]}
                        markers={markers}
                        zoom={18}
                        height={null}
                        getCoordinates={
                            creatorMode ? handleCoordinatesClick : null
                        }
                        locationLoaded={
                            !location.loading &&
                            !location.error &&
                            centerChanged
                        }
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
