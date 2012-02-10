(function(undefined) {
  
  const SRC_FOLDER = ROOT + 'src/';
  const HUB_FOLDER = SRC_FOLDER + 'hub/';
  const HUB_TPL = DIR + 'Handlers/Create/Templates/Hub/';
  const TPL_RESOLUTION = '.txt';
  
  var creators = {
    hub: function(n) {
      // Create all necessary JavaScript files
      var new_folder = HUB_FOLDER + n + '/';
      
      fs.mkdir(new_folder);
      fs.readdir(HUB_TPL, function(err, f) {
        f.forEach(function(i) {
          fs.readFile(HUB_TPL + i, 'utf-8', function(err, fc) {
            fc = fc.replace(/%name%/g, n);
            fs.writeFile(new_folder + i.replace(TPL_RESOLUTION, DEF_RESOLUTION), fc, function(err) {
              if(err) {
                Log.log('error', err);
              }
            });
          })
        });
      });
    },
    
    ext: function(n) {
      
    }
  };
  
  module.exports.Create = function(args) {
    creators[args[0]](args[1]);
  };
  
})();