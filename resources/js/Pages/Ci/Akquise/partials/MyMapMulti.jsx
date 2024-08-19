import React from "react";
import {
    MapContainer,
    TileLayer,
    Popup,
    Marker,
    WMSTileLayer,
    LayersControl,
    LayerGroup,
    Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";
import { useEffect } from "react";
import { useState } from "react";

export default function MyMapMulti({
    center,
    markers = [],
    paths = [],
    zoom = 18,
    height = "450px",
    scrollWheelZoom = true,
    getCoordinates,
    locationLoaded = false,
    rounded = true,
    currentLocation = null,
}) {
    const [map, setMap] = useState(null);
    const [gotCentered, setGotCentered] = useState(false);

    console.log(paths);
    
    const svgIcon = L.divIcon({
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-blue-600 stroke-blue-600 w-8 h-8 "><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
        className: "bg-transparent",
        iconAnchor: [15, 30],
    });
    const svgIconRed = L.divIcon({
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-red-600 stroke-red-600 w-8 h-8 "><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
        className: "bg-transparent",
        iconAnchor: [15, 30],
    });
    const svgIconYellow = L.divIcon({
        html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="fill-yellow-400 stroke-yellow-400 w-8 h-8 "><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>',
        className: "bg-transparent",
        iconAnchor: [15, 30],
    });
    const svgIconCurrentLocation = L.divIcon({
        html: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="fill-blue-600" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x"><circle cx="12" cy="12" r="10"/></svg>',
        className: "bg-transparent",
        iconAnchor: [15, 30],
    });

    useEffect(() => {
        if (map != null && locationLoaded && !gotCentered) {
            map.setView(center);
            setGotCentered(true);
        }
    }, [center, map]);

    const LocationFinderDummy = () => {
        const map = useMapEvents({
            click(e) {
                if (getCoordinates != null) {
                    getCoordinates(e.latlng.lat, e.latlng.lng);
                }
            },
        });
        return null;
    };

    return (
        <div id="mapContainer" className="h-full">
            <MapContainer
                // center={[lat, lon]}
                center={center}
                zoom={zoom}
                // maxZoom={19}
                scrollWheelZoom={scrollWheelZoom}
                className={
                    (rounded ? "rounded-lg " : "") + " shadow z-0 h-full"
                }
                style={{ height: height }}
                ref={setMap}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Open Street Map">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Geoportal">
                        <WMSTileLayer
                            // crs='Earth'
                            // crs={}
                            crs={L.CRS.EPSG4326}
                            attribution="&copy; Geodienst Hamburg"
                            params={{
                                srs: "EPSG:4326",
                                service: "WMS",
                                version: "1.1.1",
                                request: "GetMap",
                                format: "image/png",
                                transparent: true,
                                layers: "stadtplan",
                                SINGLETILE: false,
                            }}
                            url="https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Orthophotos">
                        <WMSTileLayer
                            crs={L.CRS.EPSG4326}
                            attribution="&copy; Geodienst Hamburg"
                            params={{
                                srs: "EPSG:4326",
                                service: "WMS",
                                version: "1.1.1",
                                request: "GetMap",
                                format: "image/png",
                                transparent: true,
                                layers: "dop",
                                SINGLETILE: false,
                            }}
                            url="https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Flurstücke">
                        <WMSTileLayer
                            crs={L.CRS.EPSG4326}
                            attribution="&copy; Geodienst Hamburg"
                            params={{
                                srs: "EPSG:4326",
                                service: "WMS",
                                version: "1.3.0",
                                request: "GetMap",
                                height: 47 * 4,
                                width: 75 * 4,
                                styles: "",
                                format: "image/png",
                                transparent: true,
                                layers: "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,26,27,28,29,30,32,33,34,35,36,37",
                                SINGLETILE: true,
                            }}
                            // LAYERS=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C23%2C24%2C26%2C27%2C28%2C29%2C30%2C32%2C33%2C34%2C35%2C36%2C37
                            url="https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte"
                        />
                    </LayersControl.BaseLayer>
                    {currentLocation != null && (
                        <LayersControl.Overlay
                            checked={true}
                            name="Aktuelle Position"
                            key="currentLocation"
                        >
                            <LayerGroup>
                                <Marker
                                    position={[
                                        currentLocation.lat,
                                        currentLocation.lon,
                                    ]}
                                    alt={"Marker for the current location"}
                                    icon={svgIconCurrentLocation}
                                    aria-label={
                                        "Marker for the current location"
                                    }
                                >
                                    <Popup offset={[-3, -17]}>
                                        Aktuelle Position
                                    </Popup>
                                </Marker>
                            </LayerGroup>
                        </LayersControl.Overlay>
                    )}

                    {markers?.layers?.map((layer) => {
                        return (
                            <LayersControl.Overlay
                                checked={
                                    layer.checked === undefined
                                        ? true
                                        : layer.checked
                                }
                                name={layer.name != null ? layer.name : "Layer"}
                                key={layer.name != null ? layer.name : "Layer"}
                            >
                                <LayerGroup>
                                    {layer.markers.map((marker) => {
                                        // console.log(marker);
                                        return (
                                            <Marker
                                                key={
                                                    marker.lat +
                                                    "_" +
                                                    marker.lon
                                                }
                                                position={[
                                                    marker.lat,
                                                    marker.lon,
                                                ]}
                                                alt={
                                                    "Marker for " + marker.label
                                                }
                                                icon={
                                                    layer.markerColor === "red"
                                                        ? svgIconRed
                                                        : layer.markerColor ===
                                                          "yellow"
                                                        ? svgIconYellow
                                                        : svgIcon
                                                }
                                                aria-label={
                                                    "Marker for " + marker.label
                                                }
                                            >
                                                {marker.label != undefined ? (
                                                    <Popup offset={[0, -15]}>
                                                        {marker.url != null ? (
                                                            <a
                                                                href={
                                                                    marker.url
                                                                }
                                                                aria-label={
                                                                    marker.label
                                                                }
                                                            >
                                                                {marker.label}
                                                            </a>
                                                        ) : (
                                                            marker.label
                                                        )}
                                                    </Popup>
                                                ) : (
                                                    ""
                                                )}
                                            </Marker>
                                        );
                                    })}
                                </LayerGroup>
                            </LayersControl.Overlay>
                        );
                    })}
                    {paths?.map((path, index) => {
                        return (
                            <Polyline
                                pathOptions={{ color: "blue" }}
                                positions={path.positions}
                                key={index}
                            />
                        );
                    })}
                </LayersControl>
                <LocationFinderDummy />
            </MapContainer>
        </div>
    );
}
