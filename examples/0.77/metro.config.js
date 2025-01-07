const path = require('node:path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const escape = require('escape-string-regexp');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const root = path.resolve(__dirname, '../..');
const modules = Object.keys({
  ...require('../../package.json').peerDependencies,
  ...require('../demo-kit/package.json').peerDependencies,
});

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: exclusionList([
      ...modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      ),
      /demo-kit\/node_modules\/.*/,
    ]),

    extraNodeModules: modules.reduce(
      (acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      },
      {
        'react-native-zendesk-messaging': path.join(
          __dirname,
          '../../src/index'
        ),
      }
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
