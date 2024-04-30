import { Link, useRemember } from "@inertiajs/react";
import Card from "@/Components/Card";
import LoadableMap from "./LoadableMap";
import { Button } from "@/Components/ui/button";
import { useGeolocation, useMeasure, useMediaQuery } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";

export default function SecondStep({
  className = "",
  creatables,
  domain,
  setSecondToThird,
  loaded,
}) {
  const [shownItems, setShownItems] = useRemember(10, "shownItemsCount");
  const isLargeDesktop = useMediaQuery("(min-width: 1280px)");
  const location = useGeolocation();
  const [ref, {width, height}] = useMeasure();

  // if three cols are displayed the count of shown items is divisible by three
  useEffect(() => {
    if (shownItems % 3 === 1) {
      setShownItems(shownItems + 2);
    } else if (shownItems % 3 === 2) {
      setShownItems(shownItems + 1);
    }
  }, [isLargeDesktop, width, shownItems]);

  // useEffect(() => {

  // }, [creatablesParam]);

  useEffect(() => {
    if (!location.loading && !location.error) {
      creatables.map((creatable) => {
        creatable.distance = Math.round(
          getDistanceFromLatLonInKm(
            creatable.lat,
            creatable.lon,
            location.latitude,
            location.longitude
          )
        );
      });
      creatables.sort((a, b) => a.distance - b.distance);
    }
  }, [creatables]);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  return (
    <section className={className + " text-gray-800 dark:text-gray-200"}>
      {loaded && creatables.length > 0 ? (
        <div ref={ref} className={"grid gap-3 "+(width > 700?"grid-cols-3":(width <400?"grid-cols-1":"grid-cols-2"))}>
          {creatables.map((creatable, index) =>
            index < shownItems ? (
              <Card
                key={index}
                renderImage={() => (
                  <LoadableMap
                    lat={creatable.lat}
                    lon={creatable.lon}
                    scrollWheelZoom={false}
                  />
                )}
              >
                <h2>
                  {creatable.composed.street +
                    " " +
                    creatable.composed.housenumber}
                </h2>
                <p>{creatable.composed.zip_code + " " + creatable.composed.city}</p>
                {location.loading || location.error ? (
                  ""
                ) : (
                  <p>Distanz: {creatable.distance}km</p>
                )}
                <Button
                  id={index}
                  className="w-full text-center"
                  onClick={(e) => setSecondToThird(e.target.id)}
                >
                  Weiter
                </Button>
              </Card>
            ) : (
              ""
            )
          )}
        </div>
      ) : creatables.length === 0 && loaded ? (
        <div className="flex flex-col justify-center">
          <p>Leider wurden keine Ergebnisse gefunden.</p>
          <Button
            id={0}
            className="w-full text-center"
            onClick={(e) => setSecondToThird(e.target.id)}
          >
            Trotzdem fortfahren
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      )}

      {creatables.length > 0 ? (
        <>
          <div
            className={
              "w-full flex justify-center mt-4 " +
              (shownItems >= 40 || creatables.length <= shownItems
                ? "hidden "
                : "")
            }
            hidden={shownItems >= 40 || creatables.length <= shownItems}
            aria-hidden={shownItems >= 40 || creatables.length <= shownItems}
          >
            <Button onClick={(e) => setShownItems(shownItems + 10)}>
              Mehr laden
            </Button>
          </div>
          {shownItems >= 40 ? (
            <p className="text-center mt-4 p-2">
              Noch nicht das richtige Ergebnis dabei? Dann muss vielleicht die
              Suche präzisiert werden.
              <br />
              <Link href="#firstSection">Zurück zum Formular</Link>
            </p>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
    </section>
  );
}
