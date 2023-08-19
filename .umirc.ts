import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  title: "核心计算器",
  favicons: ["./favicon.ico"],
  routes: [{ path: "/", component: "index" }],
  npmClient: "pnpm",
  tailwindcss: {},
  hash: true,
  history: { type: "hash" },
  publicPath: isDev ? "/" : "./",
  plugins: ["@umijs/plugins/dist/tailwindcss"],
  headScripts: [
    {
      content: `
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?8799418b926b0861d0acf752816920d9";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  `,
    },
  ],
});
