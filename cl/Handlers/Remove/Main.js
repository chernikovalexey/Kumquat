(function(undefined) {
    
  var removers = {
    hub: function(n) {
      var ready = [0];
      var dir = HUB_FOLDER + n + '/';
      
      
      // Firstable, remove all files from the directory
      fs.readdir(dir, function(err, f) {
        f.forEach(function(i) {
          ready.push(0);
          fs.unlink(dir + i, function() {
            ready.pop();
          });
        });
        
        ready.pop();
      });
      
      // Then remove the empty directory
      var int = setInterval(function() {
        if(Common.isEmpty(ready)) {
          fs.rmdir(dir);
          fs.unlink(PUBLIC_PAGES + n + PAGES_EXTENSION);
          clearInterval(int);
        }
      }, 1);
    },
    
    ext: function(n) {
      fs.unlink(EXT_FOLDER + n + DEF_EXTENSION);
    }
  };
  
  module.exports.Remove = function(args) {
    removers[args[0]](args[1]);
  };
  
})();