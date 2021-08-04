const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const metadata = {
  title: 'Kaiku – Reactive UI Framework for the Web',
  description:
    'A lightweight JSX-based UI framework with a freely mutable, boilerplate-free global state management.',
}

const pages = ['index', 'guide', 'playground']

const origin = process.env.NODE_ENV === 'production' ? 'https://kaiku.dev/' : ''

module.exports = {
  entry: ['./src/main.js', './src/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name]-[fullhash].js',
    assetModuleFilename: 'assets/[name]-[hash][ext][query]',
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
    new MiniCssExtractPlugin({ filename: 'assets/[name]-[fullhash].css' }),
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: './src/template.ejs',
          title: page.title,
          meta: {
            description: metadata.description,
            'og:description': metadata.description,
            'og:title': metadata.title,
          },
          origin,
          page,
          filename: page + '.html',
        })
    ),
    new HtmlWebpackInlineSVGPlugin({
      svgoConfig: [{ collapseGroups: false }],
    }),
    new CssMinimizerPlugin(),
    new FaviconsWebpackPlugin({
      logo: './assets/logo.png',
      mode: 'light',
      prefix: '',
    }),
  ],
}
