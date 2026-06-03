import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/verbraucher-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    esbuild({
      minify: true,
      target: 'es2021',
      tsconfig: './tsconfig.json',
    }),
  ],
};
