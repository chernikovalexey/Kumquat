(function(undefined) {
  
  function getFolderContents(path, callback) {
    var q = [];
    var ready = [0];
    
    fs.readdir(path, function(err, f) {
      if(!f) {
        ready = true;
        return;
      }
      
      f.forEach(function(i) {
        if(~i.indexOf(DEF_EXTENSION)) {
          q.push(path + '/' + i);
        } else {
          ready.push(0);
          getFolderContents(path + '/' + i, function(n) {
            q = q.concat(n);
            q = q.unique();
            ready.pop();
          });
        }
      });
      ready.pop();
    });
    
    var int = setInterval(function() {
      if(Common.isEmpty(ready)) {
        callback(q);
        clearInterval(int);
      }
    }, 1);
  }
  
  module.exports.get = function(list, callback) {
    if(list === '*') {
      var ready = [0];
      list = [];
      
      fs.readdir('../src', function(err, f) {
        f.forEach(function(i) {
          if(~i.indexOf(DEF_EXTENSION)) {
            list.push(i);
          } else {
            ready.push(0);
            getFolderContents('../src/' + i, function(n) {
              list = list.concat(n);
              list = list.unique();
              ready.pop();
            });
          }
        });
        ready.pop();
      });
      
      var int = setInterval(function() {
        if(Common.isEmpty(ready)) {
          callback(list);
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