const path = require('path');
const {
  ruleToRenameReactModalClassNames
} = require('../scripts/tools/webpack/shared');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../')
      },
      ruleToRenameReactModalClassNames
    ]
  }
};
