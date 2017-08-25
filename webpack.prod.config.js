var path = require("path");
const webpack = require('webpack');

module.exports = {
    target: 'web',
    entry: {
     main: './src/index.jsx'
    },
    output: {
        path: './build',
        filename: 'rapido-web.js',
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'https://rapidodesigner.com/assets/'
    },
    stats: {
      assets: false,
      warnings: true,
      errors: true,
      errorDetails: true
    },
    module: {
        loaders: [
            {
              //tell webpack to use jsx-loader for all *.jsx files
              test: /\.jsx$/,
              exclude: /node_modules/,
              loader: 'babel-loader?presets[]=es2015&presets[]=react',
              options: {
                plugins: [
                  "transform-object-rest-spread"
                ]
              }
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader?presets[]=es2015'
            },
            {
              test: /\.css$/,
              loader: "style-loader!css-loader"
            },
            {
              test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
              loader: 'url-loader?limit=10000',
            },
            {
              test: /\.(eot|ttf)$/,
              loader: 'file-loader',
            },
            {
              test: /\.scss$/,
              loaders: ['style', 'css', 'sass']
            }
        ]
    },
    plugins: [
      new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
      }),
      new webpack.DefinePlugin({
          __BACKEND: JSON.stringify("https://rapidodesigner.com")
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin()
   ],
    resolve: {
        root: [
          path.resolve('./src'),
          path.resolve('./node_modules')
        ],
        extensions: ['', '.js', '.jsx']
    }
}
