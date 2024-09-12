import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";
import { prismjsPlugin } from "vite-plugin-prismjs";
import path from "path";

export default defineConfig(({ mode }) => {
    const TARGET = mode === "development" ? "http://localhost:8888" : "/";
    console.log(`mode: ${mode}, target: ${TARGET}`);
    return {
        server: {
            proxy: {
                "/api": {
                    target: TARGET,
                    changeOrigin: true,
                },
                "/api/proxies": {
                    target: TARGET.replace("http", "ws"),
                    ws: true,
                },
            },
        },
        plugins: [
            react(),
            Pages({
                dirs: [
                    {
                        dir: "./src/pages",
                        baseRoute: "",
                    },
                ],
            }),
            prismjsPlugin({
                languages: "all",
                css: true,
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "#": path.resolve(__dirname, "."),
            },
        },
    };
});
