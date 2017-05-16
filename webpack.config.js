var path = require('path');

module.exports = {
  entry: {
    "page-one": "./src/page-one/index.js"
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  }
};
