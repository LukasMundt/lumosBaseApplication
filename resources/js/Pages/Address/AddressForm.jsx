import { usePage, useRemember } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import SecondStep from "../Ci/Akquise/partials/Create_SecondStep";
import FirstStep from "../Ci/Akquise/partials/Create_FirstStep";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import React from "react";

export default function AddressForm({
    latLon = null,
    showMapInLastStep = true,
    className = "",
    getAddressData = null,
    mode = "add",
}) {
    const { auth, domain } = usePage().props;
    const [streetAndNumber, setStreetAndNumber] = useRemember(
        "",
        "streetAndNumber"
    );
    const [step, setStepState] = useRemember(1, "step");
    const [creatables, setCreatables] = useRemember([], "creatables");
    const [rawDataLoaded, setRawDataLoaded] = useRemember(
        false,
        "rawDataLoaded"
    );
    const [errorsFirst, setErrorsFirst] = useState([]);
    const [open, setOpen] = React.useState(false);

    const resetFrom = () => {
        setCreatables([]);
        setRawDataLoaded(false);
        setStepState(1);
        setErrorsFirst([]);
        setStreetAndNumber("");
    }

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
            saveSelection(0);
        }
    }, [creatables]);

    const saveSelection = (key) => {
        // setStepState(3);

        // const res = await axios.get(
        //   route("akquise.akquise.detailsOfCreatable", {
        //     lat: key.split("_")[0],
        //     lon: key.split("_")[1],
        //     domain: domain,
        //   })
        // );
        // console.log(res);
        if (creatables.length === 0) {
            // setRawData({
            //     strasse: streetAndNumber.replace(
            //         " " + streetAndNumber.split(" ").reverse()[0],
            //         ""
            //     ),
            //     hausnummer: streetAndNumber.split(" ").reverse()[0],
            // });
        } else {
            var tempArr = creatables[key].composed;
            tempArr.lat = creatables[key].lat;
            tempArr.lon = creatables[key].lon;
            // console.log(tempArr);
            axios
                .post(
                    route("api.v1.addresses.findOrCreate", { domain: domain }),
                    tempArr
                )
                .then((response) => {
                    // console.log(response);
                    if (getAddressData != null) {
                        getAddressData(response.data);
                        resetFrom();
                    }

                    setOpen(false);
                })
                .catch((error) => console.log(error));
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    {mode === "edit" ? (
                        <Pencil className="w-5" />
                    ) : (
                        <Plus className="w-5" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adresse verbinden</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-96">
                    <div className={"mx-1" + className}>
                        {/* Eingabe Adresse */}
                        {step != 3 ? (
                            <FirstStep
                                setInput={setFromFirstToSecond}
                                streetAndNumber={streetAndNumber}
                                errors={errorsFirst}
                            />
                        ) : (
                            ""
                        )}
                        {/* Adresse mehrfach oder Adresse nicht gefunden und Frage ob veraendern */}
                        {step === 2 ? (
                            <SecondStep
                                creatables={creatables}
                                loaded={rawDataLoaded}
                                setSecondToThird={saveSelection}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
