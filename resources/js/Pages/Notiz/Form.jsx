import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { createReactEditorJS } from "react-editor-js/dist/react-editor-js.cjs";
// import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import Marker from "@editorjs/marker";
import NestedList from "@editorjs/nested-list";
import React from "react";
import InputError from "@/Components/Inputs/InputError";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";

export default function Form({
    id = null,
    defaultValue = null,
    domain,
    creationUrl,
    toggleReload = null,
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            id: id,
            notiz: defaultValue != null ? JSON.parse(defaultValue) : null,
        });
    const editorCore = React.useRef(null);

    const handleInitialize = React.useCallback((instance) => {
        editorCore.current = instance;
    }, []);

    const handleClear = React.useCallback(async () => {
        await editorCore.current.clear();
    });

    const handleSave = React.useCallback(async () => {
        return await editorCore.current.save();
    }, []);

    const ReactEditorJS = createReactEditorJS();

    const submit = async function (e) {
        e.preventDefault();
        let tempData = data;
        tempData.notiz = await handleSave();

        // post(creationUrl);
        toast.promise(
            axios
                .post(creationUrl, data)
                .then((response) => setData("id", response.data)),
            {
                loading: "Wird gespeichert...",
                success: (response) => {
                    if (toggleReload != null) {
                        toggleReload();
                    }
                    return "Notiz gespeichert";
                },
                error: "Fehler",
            }
        );
        setData("notiz", null);
    };

    return (
        <form onSubmit={submit} className="mt-6 space-y-6 p-4">
            <div className="flex justify-end gap-4 pt-4">
                <Transition
                    show={recentlySuccessful}
                    enterFrom="opacity-0"
                    leaveTo="opacity-0"
                    className="transition ease-in-out"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Saved.
                    </p>
                </Transition>
                <Button disabled={processing}>Speichern</Button>

                <Button variant="destructive" onClick={handleClear} color="failure">
                    Leeren
                </Button>
            </div>

            <div>
                <InputError className="mt-2" message={errors.related_id} />
                <InputError className="mt-2" message={errors.related_type} />
            </div>

            <ReactEditorJS
                onInitialize={handleInitialize}
                defaultValue={data.notiz}
                tools={{
                    // header: Header,
                    delimiter: Delimiter,
                    // marker: Marker,
                    // nestedList: NestedList,
                }}
                holder="custom"
            >
                <div
                    id="custom"
                    className="dark:bg-[#d1d1d1] bg-[#d1d1d1] p-4 rounded text-gray-800"
                ></div>
            </ReactEditorJS>
        </form>
    );
}
