(function(undefined) {
  
  // Path
  const PATH_TO_TPL = DIR + 'Handlers/Create/Templates/';
  const HUB_TPL     = PATH_TO_TPL + 'Hub/js/';
  const PAGE_TPL    = PATH_TO_TPL + 'Hub/html/new_page' + TPL_EXTENSION;
  const EXT_TPL     = PATH_TO_TPL + 'Ext/ext' + TPL_EXTENSION;
  
  // CL flags
  const FLAG_START       = '-';
  const CREATE_MODULE    = FLAG_START + 'f';
  const EXTEND_AS_MODULE = FLAG_START + 'm';
  
  var creators = {
    hub: function(n) {
      // Create all necessary JavaScript files
      var new_folder = HUB_FOLDER + n + '/';
      
      fs.mkdir(new_folder);
      fs.readdir(HUB_TPL, function(err, f) {
        f.forEach(function(i) {
          fs.readFile(HUB_TPL + i, 'utf-8', function(err, fc) {
            fc = fc.replace(/%name%/g, Common.capitalize(n));
            fs.writeFile(new_folder + i.replace(TPL_EXTENSION, DEF_EXTENSION), fc, function(err) {
              if(err) {
                Log.log('error', err);
              }
            });
          })
        });
      });
      
      //
      // Create public html
      fs.readFile(PAGE_TPL, 'utf-8', function(err, f) {
        fs.writeFile(PUBLIC_PAGES + n + PAGES_EXTENSION, f, function(err) {
          if(err) {
            Log.log('error', err);
          }
        });
      });
    },
    
    ext: function(n, flag) {
      if(flag === CREATE_MODULE) {
        fs.mkdir(EXT_FOLDER + n);
      } else {
        fs.readFile(EXT_TPL, 'utf-8', function(err, f) {
          f = f
            .replace(/%Name%/g, Common.capitalize(n))  // Capitalize
            .replace(/%name%/g, n);                    // Do not capitalize
          fs.writeFile(EXT_FOLDER + n.replace(/\./g, '/') + DEF_EXTENSION, f, function(e) {
            if(e) {
              Log.log('error', e);
            }
          });
        });
      }
    }
  };
  
  module.exports.Create = function(args) {
    creators[args[0]].apply(global, args[1].match(/-([a-z]+)/) ? [args[2], args[1]] : [args[1]]);
  };
  
})();