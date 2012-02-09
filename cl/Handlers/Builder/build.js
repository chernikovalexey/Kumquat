/* Kumquat Ext Builder
 * Converts Buildfile to standard Chrome manifest.json
**/

(function(DIR, undefined) {
  
  GLOBAL.buildfile = DIR + '../Buildfile';
  GLOBAL.fs        = require('fs');
  GLOBAL.l         = require(DIR + 'ext/log');
  
  var pb = require(DIR + 'parseBuild');
  var ss = require(DIR + 'substituteStandard');
  
  l.log('Building has been started.');
  pb.parse(function(o) {
    ss.substitute(o, function(so) {
      fs.writeFile(DIR + '../manifest.json', so, function(err) {
        if(err) {
          l.log('error 0', err);
        } else {
          l.log('Kumquat has been built successfully.');
        }
      });
    }, true);
  });
  
})('./');