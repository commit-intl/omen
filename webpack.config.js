module.exports = function (){
  return process.env.NODE_ENV === 'production' ?
    require('./webpack.production.config.js')
    : require('./webpack.develop.config.js')
}();