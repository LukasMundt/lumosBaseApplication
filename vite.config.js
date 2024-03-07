import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import manifestSRI from "vite-plugin-manifest-sri";

export default defineConfig({
    build: {
        minify: "terser",
    },
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
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "/logo-400x400.png",
                        sizes: "400x400",
                        type: "image/png",
                        // purpose: "maskable",
                    },
                    {
                        src: "/logo-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/logo-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
                screenshots: [
                    {
                        src: "/screenshot1.png",
                        sizes: "1918x937",
                        type: "image/png",
                        form_factor: "wide",
                        label: "The Login Page",
                    },
                    {
                        src: "/screenshot2.jpg",
                        sizes: "1080x2031",
                        type: "image/jpeg",
                        form_factor: "narrow",
                        label: "The login page on mobile screens",
                    },
                ],
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
