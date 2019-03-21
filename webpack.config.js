const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseWebpackConfig = require('./.storybook/webpack.config');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src'), /node_modules\/react-modal/],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      ...baseWebpackConfig.module.rules
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
    })
  ]
};
