import "./bootstrap";
import "../css/app.css";

// import 'flowbite';

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (name.includes("::")) {
            return resolvePageComponent(
                `../../modules/lukasmundt/akquise/src/resources/js/Pages/Index.jsx`,
                import.meta.glob(
                    "../../modules/**/src/resources/js/Pages/**/*.jsx"
                )
            );

            // return resolvePageComponent(
            //     `../../modules/${name.substring(
            //         0,
            //         name.indexOf("::")
            //     )}/src/resources/js/Pages/${name.substring(
            //         name.indexOf("::") + 2
            //     )}.jsx`,
            //     import.meta.glob(
            //         "../../modules/**/src/resources/js/Pages/**/*.jsx"
            //     )
            // );
        } else {
            return resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob("./Pages/**/*.jsx")
            );
        }
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
