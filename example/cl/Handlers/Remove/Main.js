(function(undefined) {
  
  var rmDir = function(dir, callback) {
    var ready = [0];
    
    fs.readdir(dir, function(err, f) {
      f.forEach(function(i) {
        ready.push(0);
        fs.unlink(dir + '/' + i, function() {
          ready.pop();
        });
      });
      ready.pop();
    });
    
    var int = setInterval(function() {
      if(Common.isEmpty(ready)) {
        fs.rmdir(dir);
        callback && callback();
        clearInterval(int);
      }
    }, 1);
  };
  
  var removers = {
    hub: function(n) {
      rmDir(HUB_FOLDER + n + '/', function() {
        fs.unlink(PUBLIC_PAGES + n + PAGES_EXTENSION);
      });
    },
    
    ext: function(n) {
      if(n.match(/\./)) {
        fs.unlink(EXT_FOLDER + n.replace(/\./g, '/') + DEF_EXTENSION);
      } else {
        fs.readdir(EXT_FOLDER, function(err, f) {
          // Extension is in root
          if(~f.indexOf(n + DEF_EXTENSION)) {
            fs.unlink(EXT_FOLDER + n + DEF_EXTENSION);
          } else { // Extension has the separate folder
            rmDir(EXT_FOLDER + n);
          }
        });
      }
    }
  };
  
  module.exports.Remove = function(args) {
    removers[args[0]](args[1]);
  };
  
})();