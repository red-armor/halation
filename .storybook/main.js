const path = require("path");
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: false, // type-check stories during Storybook build
  },

  // https://github.com/storybookjs/storybook/issues/11989
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "halation": path.resolve(__dirname, "../packages/halation/src"),
      "halation-lite": path.resolve(__dirname, "../packages/halation-lite/src")
    };
    config.resolve.extensions.push(".ts", ".tsx");
    // config.plugins.push(
    //   new ForkTsCheckerWebpackPlugin({
    //     tslint: path.resolve(__dirname, '../tslint.json'),
    //     tsconfig: path.resolve(__dirname, 'tsconfig.json')
    //   })
    // )
    // modules: [
    //   path.resolve(__dirname, 'node_modules'),
    //   path.resolve(__dirname, compilerOptions.baseUrl),
    // ],

    // config.resolve.modules = [
    //   ...(config.resolve.modules || []),
    //   path.resolve(__dirname, '../packages'),
    // ];

    // config.resolve.plugins.push(new TsconfigPathsPlugin({
    //   // configFile: path.resolve(__dirname, '../tsconfig.json')
    // }));

    return config;
  },
};
