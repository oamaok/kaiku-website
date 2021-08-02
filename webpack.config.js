const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const page = {
  title: 'Kaiku – Reactive UI Framework for the Web',
  description:
    'A lightweight JSX-based UI framework with a freely mutable, boilerplate-free global state management.',
}

const pages = ['index.html', 'guide.html', 'playground.html']

module.exports = {
  entry: ['./src/main.js', './src/main.scss'],
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
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    ...pages.map(
      (filename) =>
        new HtmlWebpackPlugin({
          template: './src/template.ejs',
          title: page.title,
          meta: {
            description: page.description,
            'og:description': page.description,
            'og:title': page.title,
          },
          filename,
        })
    ),
    new HtmlWebpackInlineSVGPlugin({
      svgoConfig: [{ collapseGroups: false }],
    }),
    new CssMinimizerPlugin(),
    new FaviconsWebpackPlugin({
      logo: './assets/logo.svg',
      prefix: '',
    }),
  ],
}
