const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "assets" }
      ],
    }),
  ],
  entry: './src/Main.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    static: path.join(__dirname, "build"),
    compress: false,
    port: 3000,
    hot: false,
    client: {
      overlay: false
    }
  },
};