/* Kumquat Ext Command Line
 * 
**/

(function(DIR, undefined) {
  
  // Constants
  const SLASH = '/';
  const COMMON_FOLDER = 'Common';      // Folder with autoloaded files
  const HANDLERS_FOLDER = 'Handlers';  // Command handlers
  const MAIN_FILE = 'Main.js';         // Core of each handler
  
  // =======================
  // Require necessary files
  // Add them to the global scope to get rid of the further loading them again
  
  // Filesystem API
  GLOBAL.fs = require('fs');
  
  // Every file from ./Common/ loads automatically
  fs.readdir(DIR + COMMON_FOLDER, function(err, f) {
    f.forEach(function(i) {
      GLOBAL[i] = require(DIR + COMMON_FOLDER + SLASH + i);
    });
  });
  
  // node cl.js GETS_THIS_PARAMETER option option2 ...
  var action = process.argv[2][0].toUpperCase() + process.argv[2].substring(1);
  require(DIR + HANDLERS_FOLDER + SLASH + action + SLASH + MAIN_FILE)[action](process.argv.splice(3));
  
})('./');