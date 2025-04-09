const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
// this config can be in webpack.config.js or other file with constants
var API_URL = {
  production: 'https://or.stpls.keenetic.link/api',
  development: 'https://or.stpls.keenetic.link/api'
}
// check environment mode
var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: 'development',
  entry: './src/index.jsx', // Add this if not already defined
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/', // <--- IMPORTANT!
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        'exclude': /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
    ],
  },
  resolve: {
    mainFiles: ['index', 'Index'],
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    },
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/index.html',
  })],
  devServer: {
    historyApiFallback: true,
  },
  externals: {
    // global app config object
    config: JSON.stringify({
      apiUrl: API_URL[environment],
      tepCode: '00-000025',
    }),
  },
};
