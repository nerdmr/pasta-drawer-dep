// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy'

// this override is needed because Module format cjs does not support top-level await
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');

const globals = {
  ...packageJson.devDependencies,
};

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs', // commonJS
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'esm', // ES Modules
      sourcemap: true,
    },
  ],
  plugins: [
    // peerDepsExternal(),
    json(),
    scss({
      output: false,
    }),
    replace({
      'process.env.OCR_BASE_PATH': (process.env.OCR_BASE_PATH) ? `'${process.env.OCR_BASE_PATH}'` : `'http://localhost:5000'`,
    }),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        
      },
    }),
    commonjs({
      exclude: 'node_modules',
      ignoreGlobal: true,
    }),
    copy({
      targets: [
        { src: 'www/*', dest: 'dist' }
      ]
    })
  ],
  external: Object.keys(globals),
};