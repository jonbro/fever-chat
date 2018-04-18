const path = require('path');
module.exports = {
  entry: './src/client/fever.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  watch: true,
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'public'),
  }
};