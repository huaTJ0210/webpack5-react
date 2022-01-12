const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');
const resolve = (relatedPath) => path.join(__dirname, relatedPath);

const webpackConfig = {
  mode: 'production',
  entry: './src/index.js', // webpack打包入口文件
  output: {
    path: resolve('dist'), // path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename: '[contenthash].bundle.js',
    clean: true, // 每次打包清理上一下文件
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // 确保转义尽可能少的文件
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(less)$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader }, // MiniCssExtractPlugin.loader 需要在css-loader之后解析
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 配置cssmodule
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'src'),
                exportLocalsConvention: 'camelCase',
              },
            },
          },
          { loader: 'postcss-loader' },
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } }, // 当解析antd.less，必须配置，否则会报Inline JavaScript is not enabled错误
          },
        ],
      },
      // image
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        type: 'asset',
        generator: {
          filename: 'image/[name].[hash:6][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          },
        },
      },
      // font
      {
        test: /\.(woff2?|eot|ttf)$/,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:6][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // 引用模板html文件生成项目的入口文件html
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }), // 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
  ],
};
module.exports = webpackConfig;
