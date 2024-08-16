import React from "react";
import "leaflet/dist/leaflet.css";
import MyMapMulti from "./MyMapMulti";

export default function MyMap({
    lat,
    lon,
    popup = false,
    scrollWheelZoom = true,
    props,
    currentLocation = null,
}) {
    return (
        <MyMapMulti
            center={[lat, lon]}
            scrollWheelZoom={scrollWheelZoom}
            currentLocation={currentLocation}
            markers={{
                layers: [
                    {
                        name: "Projekt",
                        checked: true,
                        markerColor: "blue",
                        markers: [
                            {
                                lat: lat,
                                lon: lon,
                            },
                        ],
                    },
                ],
            }}
            {...props}
        />
    );
}
