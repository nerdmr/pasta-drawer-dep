// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import scss from "rollup-plugin-scss";
import copy from "rollup-plugin-copy";
import autoprefixer from "autoprefixer";
import postcss from "postcss";

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

import dotenv from 'dotenv';
dotenv.config();

console.log(dotenv.parsed);
console.log(process.env.LINK_PREVIEW_PATH);



const globals = {
  ...packageJson.devDependencies,
};

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/bundle.cjs",
      format: "cjs", // commonJS
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: "esm", // ES Modules
      sourcemap: true,
    },
    {
      file: packageJson.main,
      format: "iife",
      sourcemap: true,
    },
  ],
  plugins: [
    // peerDepsExternal(),
    json(),
    scss({
      output: false,
      includePaths: ["src/"],
      processor: (css) =>
        postcss([autoprefixer])
          .process(css)
          .then((result) => result.css),
    }),
    replace({
        "process.env.OCR_BASE_PATH": JSON.stringify(process.env.OCR_BASE_PATH),
        "process.env.LINK_PREVIEW_PATH": JSON.stringify(process.env.LINK_PREVIEW_PATH),
    //   "process.env.OCR_BASE_PATH": process.env.OCR_BASE_PATH
    //     ? `'${process.env.OCR_BASE_PATH}'`
    //     : `'http://localhost:5000'`,
    }),
    // resolve(),
    // commonjs({
    //     include: /node_modules/
    // }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {},
    }),
    resolve(),
    commonjs({
        include: /node_modules/
    }),
    copy({
      targets: [{ src: "www/*", dest: "dist" }],
    }),
  ],
  external: Object.keys(globals),
};
