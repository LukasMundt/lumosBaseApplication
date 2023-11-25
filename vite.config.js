import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
// import react from '@vitejs/plugin-react';
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import manifestSRI from "vite-plugin-manifest-sri";

export default defineConfig({
    plugins: [
        [
            viteCompression({
                deleteOriginFile: false,
                ext: "",
            }),
        ],
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            manifest: {
                name: "Lumos",
                short_name: "Lumos",
                theme_color: "#ffffff",
                lang: "de",
            },
        }),
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
        manifestSRI(),
    ],
});
