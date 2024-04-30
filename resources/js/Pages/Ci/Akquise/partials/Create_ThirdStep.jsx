import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select } from "flowbite-react";
import Checkbox from "@/Components/Inputs/Checkbox";
import MyMap from "./MyMap";
import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function ThirdStep({
    className = "",
    rawData = null,
    showMap = true,
    akquiseSaved = null,
    closeDialog = null,
}) {
    const { domain } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            street: rawData.street ?? "",
            housenumber: rawData.housenumber ?? "",
            zip_code: rawData.zip_code,
            city: rawData.city,
            district: rawData.district,
            teilung: true,
            abriss: true,
            nicht_gewuenscht: false,
            retour: false,
            status: "erfasst",
            lat: rawData.lat ?? null,
            lon: rawData.lon ?? null,
        });

    const submit = (e) => {
        e.preventDefault();

        post(route("akquise.akquise.store", { domain: domain }), {
            onError: (error) => console.log(error),
            onSuccess: (response) => console.log(response),
        });
        if (akquiseSaved != null) {
            akquiseSaved();
        }
        if (closeDialog != null) {
            closeDialog(false);
        }
    };

    console.log(data);

    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">
                {rawData.lat != "" &&
                rawData.lon != "" &&
                rawData.lat != undefined &&
                rawData.lon != undefined &&
                data.lat != null &&
                data.lon != null &&
                showMap ? (
                    <MyMap
                        lat={rawData.lat}
                        lon={rawData.lon}
                        scrollWheelZoom={false}
                    />
                ) : (
                    ""
                )}

                <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {/* Strasse */}
                        <div>
                            <Label htmlFor="street">Straße</Label>

                            <Input
                                className="w-full"
                                id="street"
                                value={data.street}
                                onChange={(e) => {
                                    // setData({ lat: null, lon: null });
                                    setData({
                                        ...data,
                                        street: e.target.value,
                                        lat: null,
                                        lon: null,
                                    });
                                }}
                            />

                            <InputError
                                className="mt-2"
                                message={errors.street}
                            />
                        </div>
                        {/* Hausnummer */}
                        <div>
                            <InputLabel
                                htmlFor="housenumber"
                                value="Hausnummer"
                            />

                            <Input
                                className="w-full"
                                id="housenumber"
                                value={data.housenumber}
                                onChange={(e) => {
                                    // setData({ lat: null, lon: null });
                                    setData({
                                        ...data,
                                        housenumber: e.target.value,
                                        lat: null,
                                        lon: null,
                                    });
                                }}
                            />

                            <InputError
                                className="mt-2"
                                message={errors.housenumber}
                            />
                        </div>
                        {/* PLZ */}
                        <div>
                            <InputLabel
                                htmlFor="zip_code"
                                value="Postleitzahl"
                            />

                            <Input
                                className="w-full"
                                id="zip_code"
                                value={data.zip_code}
                                onChange={(e) => {
                                    // setData({ lat: null, lon: null });
                                    setData({
                                        ...data,
                                        zip_code: e.target.value,
                                        lat: null,
                                        lon: null,
                                    });
                                }}
                            />

                            <InputError
                                className="mt-2"
                                message={errors.zip_code}
                            />
                        </div>
                        {/* Stadtteil */}
                        <div>
                            <InputLabel htmlFor="district" value="Stadtteil" />

                            <Input
                                className="w-full"
                                id="district"
                                value={data.district}
                                onChange={(e) => {
                                    setData("district", e.target.value);
                                }}
                            />

                            <InputError
                                className="mt-2"
                                message={errors.district}
                            />
                        </div>
                        {/* Stadt */}
                        <div>
                            <InputLabel htmlFor="city" value="Stadt" />

                            <Input
                                className="w-full"
                                id="city"
                                value={data.city}
                                onChange={(e) => {
                                    setData({
                                        ...data,
                                        city: e.target.value,
                                        lat: null,
                                        lon: null,
                                    });
                                }}
                            />

                            <InputError
                                className="mt-2"
                                message={errors.city}
                            />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {/* Teilung und Abriss */}
                        <div>
                            {/* Teilung */}
                            <div>
                                <Checkbox
                                    id="teilung"
                                    checked={data.teilung}
                                    onChange={(e) => {
                                        setData("teilung", !data.teilung);
                                    }}
                                />
                                <Label className="ml-2" htmlFor="teilung">
                                    Teilung
                                </Label>
                                <InputError
                                    className="mt-2"
                                    message={errors.teilung}
                                />
                            </div>
                            {/* Abriss */}
                            <div>
                                <Checkbox
                                    id="abriss"
                                    checked={data.abriss}
                                    onChange={(e) => {
                                        setData("abriss", !data.abriss);
                                    }}
                                />
                                <Label className="ml-2" htmlFor="abriss">
                                    Abriss
                                </Label>
                                <InputError
                                    className="mt-2"
                                    message={errors.abriss}
                                />
                            </div>
                        </div>
                        {/* Nicht gewünscht und Retour */}
                        <div>
                            {/* Nicht gewünscht */}
                            <div>
                                <Checkbox
                                    id="nicht_gewuenscht"
                                    checked={data.nicht_gewuenscht}
                                    onChange={(e) => {
                                        setData(
                                            "nicht_gewuenscht",
                                            !data.nicht_gewuenscht
                                        );
                                    }}
                                />
                                <Label
                                    className="ml-2"
                                    htmlFor="nicht_gewuenscht"
                                >
                                    Nicht gewünscht
                                </Label>
                                <InputError
                                    className="mt-2"
                                    message={errors.nicht_gewuenscht}
                                />
                            </div>
                            {/* Retour */}
                            <div>
                                <Checkbox
                                    id="retour"
                                    checked={data.retour}
                                    onChange={(e) => {
                                        setData("retour", !data.retour);
                                    }}
                                />
                                <Label className="ml-2" htmlFor="retour">
                                    Retour
                                </Label>
                                <InputError
                                    className="mt-2"
                                    message={errors.retour}
                                />
                            </div>
                        </div>
                        {/* Status */}
                        <div>
                            <Label htmlFor="status">Status</Label>

                            <Select
                                className="w-full"
                                id="status"
                                value={data.status}
                                onChange={(e) => {
                                    setData("status", e.target.value);
                                }}
                            >
                                <option value="Erfasst">Erfasst</option>
                                <option value="Werbemassnahmen">
                                    Werbemaßnahmen
                                </option>
                                <option value="Nicht Gewünscht">
                                    Nicht Gewünscht
                                </option>
                                <option value="Im Verkauf">Im Verkauf</option>
                                <option value="Durch uns verkauft">
                                    Durch uns verkauft
                                </option>
                                <option value="Durch Konkurrenz behandelt">
                                    Durch Konkurrenz behandelt
                                </option>
                            </Select>

                            <InputError
                                className="mt-2"
                                message={errors.status}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Speichern</Button>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Gespeichert.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
