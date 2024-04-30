import { useRemember } from "@inertiajs/react";
import MyMap from "./MyMap";
import { Button } from "flowbite-react";

export default function LoadableMap({ lat, lon, props }) {
  const [visible, setVisibility] = useRemember(false, "visible" + lat + lon);

  return (
    <div className="h-full">
      {visible ? (
        <MyMap lat={lat} lon={lon} {...props} height="300px" />
      ) : (
        <div
          className="flex justify-center items-center"
          style={{ height: "300px" }}
        >
          <Button color="dark" onClick={(e) => setVisibility(true)}>
            Karte laden
          </Button>
        </div>
      )}
    </div>
  );
}
