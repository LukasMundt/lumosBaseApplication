// import Card from "@/Components/Card";
// import Header from "@editorjs/header";
import EditorJS from "@editorjs/editorjs";
import Delimiter from "@editorjs/delimiter";
import Header from "@editorjs/header";
// import { Marker } from "@editorjs/marker";
// import { NestedList } from "@editorjs/nested-list";
import {
    ArrowTopRightOnSquareIcon,
    ArrowUpOnSquareIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "flowbite-react";
import { createReactEditorJS } from "react-editor-js/dist/react-editor-js.cjs";
import { Card, CardContent } from "@/Components/ui/card";

export default function Notiz({
    notiz,
    className,
    link = null,
    domain,
    projekt,
}) {
    const ReactEditorJS = createReactEditorJS();

    const data = notiz.inhalt;
    const defaultValue = JSON.parse(data);

    return (
        <div className={"" + className} key={notiz.id}>
            <Card>
                <CardContent className=" relative">
                    <ReactEditorJS
                        // onInitialize={handleInitialize}
                        narrow={false}
                        minHeight={0}
                        readOnly
                        defaultValue={defaultValue}
                        tools={{
                            header: Header,
                            delimiter: Delimiter,
                            // marker: Marker,
                            // nestedList: NestedList,
                        }}
                        holder={"custom" + notiz.id}
                    >
                        <div id={"custom" + notiz.id} className="p-0"></div>
                    </ReactEditorJS>
                </CardContent>
                {/* <div className="absolute z-30 right-0 pr-4">
          <div className="relative">
            <Button
              color="gray"
              size="sm"
              href={route("akquise.akquise.showMitNotiz", {
                projekt: projekt.id,
                notiz: notiz.id,
                domain: domain
              })}
              title="Notiz bearbeiten"
            >
              <>
                <ArrowTopRightOnSquareIcon className="w-6" />
              </>
            </Button>
          </div>
        </div> */}
            </Card>
        </div>
    );
}
