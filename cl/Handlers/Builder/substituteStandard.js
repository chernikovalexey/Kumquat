(function(DIR, undefined) {
  
  var ox = require(DIR + 'ext/objectExtend');
  
  var ok_props = 'title,default_title'.split(',');
  var updated = (
    'icons,browser_action,page_action,background_page,options_page'
  ).split(',');
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
        '/pages/window.html' : 
        '';
    },
    background_page: function() {
      return '/pages/background.html';
    },
    options_page: function() {
      return '/pages/options.html';
    }
  };
  
  function detailedReview(o) {
    for(var key in o) {
      if(!~ok_props.indexOf(key)) {
        o[key] = transforms[key](o[key]);
      }
    }
    
    return o;
  }
  
  // flag - stringify or no
  function substitute(o, callback, flag) {
    l.log('log 1', 'Transforming build to manifest.json standard..');
    
    var standard = ox.extend({}, o);
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
      
      if(ox.isEmpty(standard[key]) || (any > 1 && key in by_once)) {
        delete standard[key];
      }
    }
    
    if(connected._locales > 0 && connected.default_locale === 0) {
      delete standard._locales;
    } else if(connected._locales === 0 && connected.default_locale > 0) {
      delete standard.default_locale;
    }
    
    l.log('log 2', 'OK.');
    
    callback((flag ? JSON.stringify : __return__)(standard));
  }
  
  module.exports.substitute = substitute;
  
})('./');