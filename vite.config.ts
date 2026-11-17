/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages serves the app from /copilot-launchpad/; local dev and tests use /.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/copilot-launchpad/" : "/",
  plugins: [react()],
  build: { sourcemap: false },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
}));
