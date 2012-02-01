(function(DIR, undefined) {
  
  var ox = require(DIR + 'ext/objectExtend');
  
  var okProps = 'title,default_title'.split(',');
  var updated = (
    'icons,browser_action,page_action,background_page,options_page'
  ).split(',');
  
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
      if(!~okProps.indexOf(key)) {
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
      
      // Not as in the standard
      if(~updated.indexOf(key)) {
        if(typeof standard[key] !== 'object') {
          standard[key] = transforms[key](standard[key]);
        } else {
          standard[key] = detailedReview(standard[key]);
        }
      }
      
      if(ox.isEmpty(standard[key])) {
        delete standard[key];
      }
    }
    
    l.log('log 2', 'OK.');
    
    callback((flag ? JSON.stringify : __return__)(standard));
  }
  
  module.exports.substitute = substitute;
  
})('./');