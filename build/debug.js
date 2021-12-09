

var config = require('../config/index.js');
var debug = config.debug ;
if (debug.allow && debug.weinre.compileStart){

  var Weinre = require('weinre');
  var weinreOptions = require('../config/debug.conf.js');

  Weinre.run(weinreOptions);

}



