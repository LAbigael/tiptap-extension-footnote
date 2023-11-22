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
  external: ["@tiptap/core", "@tiptap/pm/history","@tiptap/pm/transform","@tiptap/pm/state","@tiptap/pm/history","@tiptap/pm/keymap","@tiptap/pm/view"],
  plugins: [
    sourcemaps(),
    babel(),
    commonjs(),
  ],
};

module.exports = config;
