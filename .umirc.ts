import { defineConfig } from "umi";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  title: "Boost nodes calculator",
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
  metas: [
    {
      name: "keywords",
      content:
        "maplestory, boost nodes, calculator, 冒险岛, 枫之谷, 核心计算器",
    },
    {
      name: "description",
      content:
        "A calculator designed for filtering perfect boost nodes. 用于计算完美核心的核心计算器。",
    },
  ],
});
