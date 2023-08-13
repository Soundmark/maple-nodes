import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  routes: [{ path: "/", component: "index" }],
  npmClient: "pnpm",
  tailwindcss: {},
  hash: true,
  publicPath: isDev ? "/" : "./",
  plugins: ["@umijs/plugins/dist/tailwindcss"],
});
