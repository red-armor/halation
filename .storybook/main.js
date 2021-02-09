const path = require("path");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },

  // https://github.com/storybookjs/storybook/issues/11989
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "halation": path.resolve(__dirname, "../packages/halation/src"),
    };
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
};
