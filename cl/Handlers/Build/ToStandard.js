(function(undefined) {
  
  var ok_props = 'title,default_title,matches'.split(',');
  var updated = (
    'icons,browser_action,page_action,background_page,options_page,content_scripts'
  ).split(',');
  var withMerge = 'js,css'.split(','); // Predominantly, for `content_scripts`
  var by_once = {
    browser_action: 0,
    page_action: 0
  };
  var connected = {
    _locales: 0,
    default_locale: 0
  };
  
  var transforms = {
    icon: function(name) {
      var resolution = name.match(/(\.)+([a-z]+){3}/) ? '' : '.png';
      return '/resources/images/icons/' + name + resolution;
    },
    default_icon: function(n) {
      return this.icon(n);
    },
    16: function(n) {
      return this.icon(n);
    },
    48: function(n) {
      return this.icon(n);
    },
    128: function(n) {
      return this.icon(n);
    },
    popup: function(flag) {
      return typeof flag === 'undefined' || flag === true ? 
        '/pages/public/window.html' : 
        '';
    },
    background_page: function() {
      return '/pages/internal/background.html';
    },
    options_page: function() {
      return '/pages/public/options.html';
    },
    js: function() {
      return [
        'src/lib/prevel.js', 'src/kernel/kernel.js'
      ];
    },
    css: function() {
      return [
        'resources/styles/pages/common/main.css', 
        'resources/styles/pages/internal/content.css'
      ];
    }
  };
  
  function detailedReview(o) {
    for(var key in o) {
      if(!~ok_props.indexOf(key)) {
        if(Array.isArray(o)) {
          o[key] = detailedReview(o[key]);
        } else {
          var tmp;
          if(Array.isArray(o[key])) {
            tmp = transforms[key](o[key][0]).concat(o[key].splice(1, o[key].length));
          } else {
            tmp = transforms[key](o[key]);
          }
          o[key] = tmp;
        }
      }
    }
    
    return o;
  }
  
  // flag - stringify or no
  function substitute(o, callback, flag) {
    Log.log('log 1', 'Transforming build to manifest.json standard..');
    
    var standard = Common.extend({}, o);
    var __return__ = function(o) {return o;};
    
    for(var key in standard) {
      
      if(key in connected) {
        ++connected[key];
      }
      
      // Not as in the standard
      if(~updated.indexOf(key)) {
        if(typeof standard[key] !== 'object') {
          standard[key] = transforms[key](standard[key]);
        } else {
          if(key in by_once) {
            ++by_once[key];
          }
          
          standard[key] = detailedReview(standard[key]);
        }
      }
      
      var any = 0;
      for(var container in by_once) {
        if(by_once[container] > 0) {
          ++any;
        }
      }
      
      if(Common.isEmpty(standard[key]) || (any > 1 && key in by_once)) {
        delete standard[key];
      }
    }
    
    Log.log('log 2', 'OK.');
    
    callback((flag ? JSON.stringify : __return__)(standard));
  }
  
  module.exports.substitute = substitute;
  
})();