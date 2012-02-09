(function(undefined) {
    
  function parse(callback) {
    Log.log('log 1', 'Reading build file..');
    
    fs.readFile(BUILD_FILE, 'utf-8', function(err, f) {
      Log.log('log 2', 'Parsing build file..');

      callback(Common.parseJSON(f));
    });
  }
  
  module.exports.parse = parse;
  
})();