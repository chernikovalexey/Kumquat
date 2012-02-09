(function(undefined) {
  
  function getFolderContents(path, callback) {
    var q = [];
    var ready = false;
    
    fs.readdir(path, function(err, f) {
      if(!f) {
        ready = true;
        return;
      }
      
      f.forEach(function(i) {
        if(~i.indexOf(DEF_RESOLUTION)) {
          q.push(path + '/' + i);
        } else {
          console.log(path + '/' + i);
          getFolderContents(path + '/' + i, function(n) {
            q = q.concat(n);
            q = q.unique();
          });
        }
      });
      ready = true;
    });
    
    var int = setInterval(function() {
      if(ready) {
        callback(q);
        clearInterval(int);
      }
    }, 1);
  }
  
  module.exports.get = function(list, callback) {
    if(list === '*') {
      var ready = false;
      list = [];
      
      fs.readdir('../src', function(err, f) {
        f.forEach(function(i) {
          if(~i.indexOf(DEF_RESOLUTION)) {
            list.push(i);
          } else {
            getFolderContents('../src/' + i, function(n) {
              console.log(n);
              list = list.concat(n);
              list = list.unique();
            });
          }
        });
        ready = true;
      });
      
      var int = setInterval(function() {
        if(ready) {
          callback(list.map(function(e) {
            return '../src/' + e;
          }));
          clearInterval(int);
        }
      }, 1);
    } else if(!Common.isEmpty(list)) {
      list = list.split(',').map(function(e) {
        return '../src/' + e.trim().replace(/\./g, '/') + '.js';
      });
      
      callback(list);
    }
  };
  
})();