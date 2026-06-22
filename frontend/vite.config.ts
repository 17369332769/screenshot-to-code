import path from "path";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    base: "",
    plugins: [
      react(),
      checker({ 
        typescript: true
      }),
      createHtmlPlugin({
        inject: {
          data: {
            injectHead: process.env.VITE_IS_DEPLOYED
              ? '<script defer="" data-domain="screenshottocode.com" src="https://plausible.io/js/script.js"></script>'
              : "",
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return undefined;
            }

            if (
              id.includes("react-dom") ||
              id.includes("react-router") ||
              id.includes("/react/")
            ) {
              return "react-vendor";
            }

            if (
              id.includes("@codemirror") ||
              id.includes("codemirror") ||
              id.includes("thememirror")
            ) {
              return "editor-vendor";
            }

            if (
              id.includes("react-markdown") ||
              id.includes("remark") ||
              id.includes("unified") ||
              id.includes("micromark") ||
              id.includes("mdast") ||
              id.includes("hast") ||
              id.includes("property-information")
            ) {
              return "markdown-vendor";
            }

            if (id.includes("@radix-ui")) {
              return "radix-vendor";
            }

            if (id.includes("react-icons")) {
              return "icons-vendor";
            }

            return "vendor";
          },
        },
      },
    },
  });
};
