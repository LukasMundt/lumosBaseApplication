import { useEffect, useState } from "react";
import { RecordingTable } from "./partials/tableRecordings";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";

export default function Index({ domain, setBreadcrumb }) {
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [recordings, setRecordings] = useState([]);

    setBreadcrumb("Alle Aufnahmen");

    useEffect(() => {
        if (!loaded && !loading) {
            setLoading(true);
            axios
                .get(
                    route("api.v1.ci.akquise.mobile-recording.index", {
                        domain: domain,
                    })
                )
                .then((response) => {
                    console.log(response.data);
                    setRecordings(response.data);
                    setLoading(false);
                    setLoaded(true);
                });
        }
    }, [loaded]);

    return (
        <>
            <RecordingTable
                domain={domain}
                data={recordings}
                buttons={
                    <div className="flex">
                        <Link to="/new-recording">
                            <Button>Neue Aufnahme</Button>
                        </Link>
                    </div>
                }
                loading={loading}
            />
        </>
    );
}
