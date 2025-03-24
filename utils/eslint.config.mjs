// @ts-check

import eslint from '@eslint/js';
import globals from "globals";
import tseslint from 'typescript-eslint';

console.log(eslint.configs.recommended);

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      }
    }
  },
);
