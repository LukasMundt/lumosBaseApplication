import "./bootstrap";
import "../css/app.css";

import "flowbite";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import * as Sentry from "@sentry/react";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({
            // Additional SDK configuration goes in here, for example:
            colorScheme: "system",
            isEmailRequired: true,
            nameLabel: "Name",
            emailLabel: "Email",
            isRequiredLabel: "erforderlich",
            buttonLabel: "Fehler melden",
            cancelButtonLabel: "Abbrechen",
            submitButtonLabel: "Melden",
            messageLabel: "Nachricht",
            messagePlaceholder: "Was ist der Fehler? Was haben Sie erwartet?",
            namePlaceholder: "Ihr Name",
            successMessageText: "Vielen Dank!",
            showBranding: false,
            showName: false
        }),
    ],

    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["*"],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (name.includes("::")) {
            // return resolvePageComponent(
            //     `../../modules/lukasmundt/akquise/src/resources/js/Pages/Index.jsx`,
            //     import.meta.glob(
            //         "../../modules/**/src/resources/js/Pages/**/*.jsx"
            //     )
            // );

            return resolvePageComponent(
                `../../vendor/${name.substring(
                    0,
                    name.indexOf("::")
                )}/src/resources/js/Pages/${name.substring(
                    name.indexOf("::") + 2
                )}.jsx`,
                import.meta.glob(
                    "../../vendor/**/src/resources/js/Pages/**/*.jsx"
                )
            );
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
