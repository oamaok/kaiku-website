const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const page = {
  title: 'Kaiku – Reactive UI Framework for the Web',
  description:
    'A lightweight JSX-based UI framework with a freely mutable, boilerplate-free global state management.',
}

module.exports = {
  entry: ['./src/index.js', './src/style.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true,
  },
  mode: process.env.NODE_ENV,
  devtool: false,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.jsx$/i,
        use: 'babel-loader',
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'main.css' }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: page.title,
      meta: {
        description: page.description,
        'og:description': page.description,
        'og:title': page.title,
      },
    }),
    new CssMinimizerPlugin(),
    new FaviconsWebpackPlugin({
      logo: './assets/logo.svg',
      prefix: '',
    }),
  ],
}
