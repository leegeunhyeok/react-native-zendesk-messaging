import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'react-native',
  modulePathIgnorePatterns: [
    '<rootDir>/example/node_modules',
    '<rootDir>/lib/',
  ],
};

// eslint-disable-next-line import/no-default-export -- test
export default config;
