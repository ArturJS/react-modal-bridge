const path = require('path');
const webpackMerge = require('webpack-merge');
const {
  ruleToRenameReactModalClassNames
} = require('../scripts/tools/webpack/shared');

module.exports = ({ config, mode }) => {
  // in order to fix https://github.com/storybookjs/storybook/issues/6204
  delete config.resolve.alias['core-js'];

  return webpackMerge(config, {
    module: {
      rules: [
        {
          test: /\.stories\.jsx?$/,
          loaders: [require.resolve('@storybook/source-loader')],
          enforce: 'pre'
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader'],
          include: path.resolve(__dirname, '../')
        },
        ruleToRenameReactModalClassNames
      ]
    }
  });
};
