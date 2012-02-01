(function(undefined) {
  
  function argsToArray(a) {
    var args = [];
    for(var key in a) {
      args.push(a[key]);
    }
    return args;
  }
  
  function log() {
    // Object to an ordinary array
    arguments = argsToArray(arguments);
    
    var flags = 
      arguments[0] && typeof arguments[0] === 'string' && arguments[0].match('(error||log|\\s)+([(0-9)+])') ? 
        arguments.shift().split(' ') : 
        ['', 0];
  
    var action = flags[0] in {error: 0, log: 0} ? flags[0] : 'log';
    var nested = !isNaN(+flags[1]) ? +flags[1] : 0;
    
    // Padding
    var before = '';
    
    for(var key = 0; key < nested; ++key) {
      before += '  ';
    }
    
    if(action === 'error') {
      arguments.unshift('ERROR:');
    }
    arguments.unshift(before);
    console.log.apply(console, arguments);
  }
  
  module.exports.log = log;
  
})();