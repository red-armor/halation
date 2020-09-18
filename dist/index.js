
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./halation.cjs.production.min.js')
} else {
  module.exports = require('./halation.cjs.development.js')
}
