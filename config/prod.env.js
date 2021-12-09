'use strict'

var weinreOptions = require('./debug.conf.js');
var config = require('./index.js');
var weinreDomain = weinreOptions.boundHost + ":" + weinreOptions.httpPort ;

module.exports = {
  NODE_ENV: '"production"',
  // NODE_ENV: '"development"',
  PWA:JSON.stringify(config.PWA),
  debug: JSON.stringify(config.debug),
  weinreDomain: JSON.stringify(weinreDomain)
}
