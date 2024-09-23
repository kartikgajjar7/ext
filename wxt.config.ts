// import { defineConfig } from 'wxt';

// // See https://wxt.dev/api/config.html
// export default defineConfig({
//   modules: ['@wxt-dev/module-react'],
// });
import { defineConfig } from "wxt";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
  }),
});
