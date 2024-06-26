/**
 * @type {import('rollup').RollupOptions}
 */

import pkg from './package.json' assert { type: 'json' };

import { defineConfig } from 'rollup';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.NODE_ENV === 'production';

const defaultOutput = {
  chunkFileNames: 'r/oci-[hash].js',
  esModule: true,
  exports: 'auto',
  generatedCode: 'es5',
  indent: false,
  interop: 'compat',
  sourcemap: 'inline',
  validate: true,
};

export default defineConfig({
  perf: true,
  logLevel: 'info',
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      ...defaultOutput,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      ...defaultOutput,
    },
    {
      file: 'dist/index.js',
      format: 'module',
      ...defaultOutput,
    },
  ],
  external: Object.keys(pkg.dependencies),
  plugins: [
    builtins(),
    commonjs({ exclude: ['node_modules/**'] }),
    globals(),
    json(),
    polyfillNode({
      include: [
        'assert',
        'browser',
        'browserify',
        'buffer',
        'Buffer',
        'crypto',
        'crypto-browserify',
        'readable-stream',
        'stream',
      ],
    }),
    resolve({
      preferBuiltins: true,
    }),
    isProduction && terser(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
});
