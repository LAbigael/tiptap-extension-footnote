// rollup.config.js

const sourcemaps = require("rollup-plugin-sourcemaps");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");

const config = {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/index.js",
      format: "esm",
      exports: "named",
      sourcemap: true,
    },
  ],
  external: ["@tiptap/core", "@tiptap/pm", "@tiptap/starter-kit", "uid", "@tiptap/extension-text-style"],
  plugins: [
    sourcemaps(),
    babel(),
    commonjs(),
  ],
};

module.exports = config;
