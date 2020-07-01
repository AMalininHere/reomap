const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => {
  const port = process.env.PORT || 3000;
  const mode = process.env.NODE_ENV || (args.prod && 'production') || 'development';
  const isProduction = mode === 'production';

  return {
    entry: {
      main: './src/index.tsx'
    },
    devtool: (isProduction ? 'source-map' : 'eval-source-map'),
    resolve: {
      modules: [path.join(__dirname, '../'), 'node_modules'],
      plugins: [
        new TsconfigPathsPlugin()
      ],
      extensions: ['.tsx', '.ts', '.js']
    },
    target: "web",
    mode,
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: (isProduction ? '[name].[contenthash:8].js' : '[name].js'),
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new ForkTsCheckerWebpackPlugin()
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendorReact: {
            test: /[\\/]node_modules[\\/]react/,
            chunks: 'initial',
            name: 'vendor.react',
            enforce: true,
            priority: -1000
          },
        }
      }
    },
    devServer: {
      port,
      host: 'localhost',
      contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: true,
    }
  };
};
