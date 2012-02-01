(function(undefined) {
  
  // Override, because of the requirement in ignoring comments
  JSON.parse = function(data) {
    return (!(/[^,:{}[]0-9.-+Eaeflnr-u nrt]/.test(
      data.replace(/"(.|[^"])*"/g, ''))) && eval('(' + data + ')')
    );
  };
  
  function parse(callback) {
    l.log('log 1', 'Reading build file..');
    
    fs.readFile(buildfile, 'utf-8', function(err, f) {
      l.log('log 2', 'Parsing build file..');
      
      callback(JSON.parse(f));
      
      l.log('log 3', 'OK.');
    });
  }
  
  module.exports.parse = parse;
  
})();