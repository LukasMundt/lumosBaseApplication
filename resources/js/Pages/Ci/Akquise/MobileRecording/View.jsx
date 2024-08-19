import CreateMap from "./partials/CreateMap";
import { useParams } from "react-router-dom";
import MyAudioPlayer from "./partials/MyAudioPlayer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function View({ domain }) {
    const params = useParams();
    const [recording, setRecording] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (!loading && !loaded) {
            setLoading(true);
            axios
                .get(
                    route("api.v1.ci.akquise.mobile-recording.show", {
                        domain: domain,
                        recording: params.recording,
                    })
                )
                .then((response) => {
                    console.log(response.data);
                    setRecording(response.data);
                    const localLocations = [];
                    response.data.locations.map((location) => {
                        localLocations.push([
                            parseFloat(location.latitude),
                            parseFloat(location.longitude),
                        ]);
                    });
                    if (localLocations.length == 1) {
                        localLocations.push(localLocations[0]);
                    }
                    setLocations(localLocations);
                    setLoading(false);
                    setLoaded(true);
                })
                .catch((error) => {
                    if (error.response.status == 403) {
                        toast.error(
                            "Du darfst auf diese Aufnahme nicht zugreifen."
                        );
                    } else if (error.response.status == 500) {
                        toast.error("Interner Serverfehler.");
                    } else {
                        toast.error("Fehler");
                    }
                });
        }
    }, [loaded]);

    return (
        <div className="flex flex-col h-full">
            <MyAudioPlayer
                src={route("api.v1.ci.akquise.mobile-recording.get-audio", {
                    domain: domain,
                    recording: params.recording,
                })}
                onCurrentTimeChange={(time) => console.log(time)}
            />
            {locations?.length > 0 ? (
                <CreateMap
                    domain={domain}
                    locations={locations}
                    center={locations[0]}
                />
            ) : null}
        </div>
    );
}
