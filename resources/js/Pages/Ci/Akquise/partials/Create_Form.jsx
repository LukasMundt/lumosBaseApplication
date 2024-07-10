import { usePage, useRemember } from "@inertiajs/react";
import { useState } from "react";
import FirstStep from "./Create_FirstStep";
import SecondStep from "./Create_SecondStep";
import ThirdStep from "./Create_ThirdStep";
import { useEffect } from "react";
import axios from "axios";
import LoadingIcon from "@/Components/LoadingIcon";

export default function Create_Form({
    latLon = null,
    showMapInLastStep = true,
    className = "",
    getAddressId,
    closeDialog = null,
}) {
    const { auth, domain } = usePage().props;
    const [streetAndNumber, setStreetAndNumber] = useRemember(
        "",
        "streetAndNumber"
    );
    const [step, setStepState] = useRemember(1, "step");
    const [creatables, setCreatables] = useRemember([], "creatables");
    const [key, setKeyState] = useRemember(0, "key");
    const [rawData, setRawData] = useRemember([], "rawData");
    const [rawDataLoaded, setRawDataLoaded] = useRemember(
        false,
        "rawDataLoaded"
    );
    const [errorsFirst, setErrorsFirst] = useState([]);

    const akquiseSaved = () => {
        setStepState(1);
        setCreatables([]);
        setKeyState(0);
        setRawData([]);
        setRawDataLoaded(false);
        setErrorsFirst([]);
    };

    const setFromFirstToSecond = async (streetAndNumber) => {
        setStepState(2);
        setStreetAndNumber(streetAndNumber);
        axios
            .get(
                route("akquise.akquise.listcreatables", {
                    street_and_number: streetAndNumber,
                    address_types: "building,place",
                })
            )
            .then((response) => {
                setCreatables(response.data);
                setErrorsFirst([]);
                setRawDataLoaded(true);
            })
            .catch((error) => {
                setCreatables([]);
                setErrorsFirst(error.response.data.errors);
                if ((error.response.data.errors ?? []).length === 0) {
                    setErrorsFirst(error.response.status);
                }
            });
        // .then((response) => {
        //   updateResult(response.data);
        //   updateErrors([]);
        // })
        // .catch((error) => {
        //   updateErrors(error.response.data.errors);
        //   updateResult(false);
        // });
        // setCreatables(res.data);
        // setRawDataLoaded(true);

        // router.get("", { step: step }, { replace: true, preserveState: true });
    };
    useEffect(() => {
        if (latLon != null) {
            axios
                .get(
                    route("akquise.akquise.detailsOfCreatable", {
                        lat: latLon.lat,
                        lon: latLon.lon,
                        domain: domain,
                    })
                )
                .then((response) => {
                    setStepState(3);
                    setRawData(response.data);
                });
        } else if (latLon === null) {
            setStepState(null);
        }
    }, [latLon]);

    useEffect(() => {
        if (creatables.length === 1) {
            setSecondToThird(0);
        }
    }, [creatables]);

    const setSecondToThird = (key) => {
        setKeyState(key);
        setStepState(3);

        // const res = await axios.get(
        //   route("akquise.akquise.detailsOfCreatable", {
        //     lat: key.split("_")[0],
        //     lon: key.split("_")[1],
        //     domain: domain,
        //   })
        // );
        // console.log(res);
        if (creatables.length === 0) {
            setRawData({
                strasse: streetAndNumber.replace(
                    " " + streetAndNumber.split(" ").reverse()[0],
                    ""
                ),
                hausnummer: streetAndNumber.split(" ").reverse()[0],
            });
        } else {
            var tempArr = creatables[key].composed;
            tempArr.lat = creatables[key].lat;
            tempArr.lon = creatables[key].lon;
            setRawData(tempArr);
            // axios
            //     .post(
            //         route("api.v1.addresses.findOrCreate", { domain: domain }),
            //         tempArr
            //     )
            //     .then((response) => console.log(response))
            //     .catch((error) => console.log(error));
        }
    };

    return (
        <div className={className}>
            {/* Eingabe Adresse */}
            {step != 3 && latLon == null ? (
                <FirstStep
                    setInput={setFromFirstToSecond}
                    streetAndNumber={streetAndNumber}
                    errors={errorsFirst}
                />
            ) : (
                ""
            )}
            {step != 3 && latLon ? (
                <div className="w-full flex justify-center items-center h-32">
                    <LoadingIcon />
                </div>
            ) : (
                ""
            )}
            {/* Adresse mehrfach oder Adresse nicht gefunden und Frage ob veraendern */}
            {step === 2 ? (
                <SecondStep
                    creatables={creatables}
                    loaded={rawDataLoaded}
                    setSecondToThird={setSecondToThird}
                />
            ) : (
                ""
            )}
            {/* Adresse ausgewaehlt, weitere Dateneingabe */}
            {step === 3 ? (
                <ThirdStep
                    rawData={rawData}
                    showMap={showMapInLastStep}
                    akquiseSaved={akquiseSaved}
                    closeDialog={closeDialog}
                />
            ) : (
                ""
            )}
        </div>
    );
}
