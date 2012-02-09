(function(undefined) {
  
  var uj = require(ROOT + ROOT + 'Common/UglifyJS/uglify-js.js');
  var gfq = require(DIR + 'GetFileQueue');
  
  var ast = null;
  
  module.exports.Minify = function(args) {
    gfq.get(args[0], function(q) {
      q.forEach(function(i) {
        fs.readFile(i, 'utf-8', function(err, f) {
          ast = uj.parser.parse(f);         // Parse code and get the initial AST
          ast = uj.uglify.ast_mangle(ast);  // Get a new AST with mangled names
          ast = uj.uglify.ast_squeeze(ast); // Get an AST with compression optimizations

          fs.writeFile(i, uj.uglify.gen_code(ast), function(e) {
            if(e) {
              Log.log('error', 'could not minify', i);
            } else {
              Log.log(i, 'minified.');
            }
          });
        });
      });
    });
  };
  
})();