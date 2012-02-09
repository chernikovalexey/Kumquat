/* Kumquat Ext Command Line
 * 
 * Provides routing and executing Kumquat CL commands.
**/

(function(DIR, undefined) {
  
  // Constants
  const SLASH = '/';
  const DEF_RESOLUTION = '.js';
  const COMMON_FOLDER = 'Common';            // Folder with autoloaded files
  const HANDLERS_FOLDER = 'Handlers';        // Command handlers
  const MAIN_FILE = 'Main' + DEF_RESOLUTION; // Core of each handler
  
  // Must be global, because of a few files
  global.ROOT = '../';
  global.BUILD_FILE = DIR + ROOT + 'Buildfile';
  global.MANIFEST_FILE = DIR + ROOT + 'manifest.json';
  
  // =======================
  // Require necessary files
  // Add them to the global scope to get rid of the further loading them again
  
  // Filesystem API
  global.fs = require('fs');
  
  // Fire command handlers only when all common files loaded
  var ready = [false, false];  
  
  // Every file from ./Common/ loads automatically
  fs.readdir(DIR + COMMON_FOLDER, function(err, f) {
    f.forEach(function(i, k) {
      global[i.replace(DEF_RESOLUTION, '')] = require(DIR + COMMON_FOLDER + SLASH + i);
      if(f.length === k + 1) {
        ready[1] = true;
      }
    });
    ready[0] = true;
  });
  
  var int = setInterval(function() {
    if(!~ready.indexOf(false)) {
      resume();
      clearInterval(int);
    }
  }, 1);
  
  // After everything loaded
  function resume() {    
    // node cl.js GETS_THIS_PARAMETER option option2 ...
    var action = process.argv[2][0].toUpperCase() + process.argv[2].substring(1);
    require(DIR + HANDLERS_FOLDER + SLASH + action + SLASH + MAIN_FILE)[action](process.argv.splice(3));
  }
  
})('./');