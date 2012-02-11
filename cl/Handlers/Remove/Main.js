(function(undefined) {
  
  var removers = {
    hub: function(n) {
      fs.rmdir();
    },
    
    ext: function(n) {
      
    }
  };
  
  module.exports.Remove = function(args) {
    removers[args[0]](args[1]);
  };
  
})();