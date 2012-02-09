/* Kumquat Ext Builder
 * Converts Buildfile to standard Chrome manifest.json
**/

(function(DIR, undefined) {
    
  var pb = require(DIR + 'ParseBuild');
  var ts = require(DIR + 'ToStandard');
  
  module.exports.Build = function() {
    Log.log('Building has been started.');
    pb.parse(function(o) {
      ts.substitute(o, function(so) {
        fs.writeFile(MANIFEST_FILE, so, function(err) {
          if(err) {
            Log.log('error 0', err);
          } else {
            Log.log('Kumquat has been built successfully.');
          }
        });
      }, true);
    });
  };
  
})('./');