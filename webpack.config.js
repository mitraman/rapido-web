var path = require("path");

module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: 'rapido-web.js',
        //make sure port 8090 is used when launching webpack-dev-server
        publicPath: 'http://localhost:8090/assets'
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=es2015&presets[]=react'
            },
            { test: /\.css$/,
              loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        root: [
          path.resolve('./src'),
          path.resolve('./node_modules')
        ],
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
      watchOptions: {
        // Needed for Windows Subsystem for Linux dev environment:
        poll: true
      }
    }
}
