import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  minify: !isDev,
  format: ["esm"],
  target: "es2022",
  outDir: "dist",
});
