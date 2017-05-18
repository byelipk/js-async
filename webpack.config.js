var path = require('path');

module.exports = {
  entry: {
    "page-one": "./src/js/page-one/index.js",
    "page-two": "./src/js/page-two/index.js",
    "page-three": "./src/js/page-three/index.js",
    "page-four": "./src/js/page-four/index.js"
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  }
};
