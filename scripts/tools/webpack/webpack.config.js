const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const { ruleToRenameReactModalClassNames } = require('./shared');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../../../build'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../../../src'),
          /node_modules\/react-modal/
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      ruleToRenameReactModalClassNames
    ]
  },
  externals: {
    react: 'umd react', // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    'react-dom': 'umd react-dom',
    '@babel/runtime': '@babel/runtime'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'webpack-bundle-report.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'react-modal-bridge.css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    new WebpackShellPlugin({
      onBuildEnd: ['npx cp src/index.d.ts build']
    })
  ]
};
