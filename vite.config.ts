import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Em produção o nginx da frente serve /sprites/ com cache; aqui o Vite repassa para o GitHub.
const sprites = {
  "/sprites": {
    target: "https://raw.githubusercontent.com",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/sprites/, "/PokeAPI/sprites/master/sprites/pokemon"),
  },
};

export default defineConfig({
  plugins: [vue()],
  server: { proxy: sprites },
  preview: { proxy: sprites },
});
