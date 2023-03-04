import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    typescript({ tsconfig: './tsconfig.build.json', sourceMap: true }),
    css({ output: 'styles.css' }),
    copy({
      targets: [
        {
          src: 'src/*.css',
          dest: 'dist',
        },
      ],
    }),
  ],
};
