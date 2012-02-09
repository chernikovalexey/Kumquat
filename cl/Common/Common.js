(function(undefined) {
  
  // For export
  
  // Parse JSON, irrespective comments
  module.exports.parseJSON = function(data) {
    return (!(/[^,:{}[]0-9.-+Eaeflnr-u nrt]/.test(
      data.replace(/"(.|[^"])*"/g, ''))) && eval('(' + data + ')')
    );
  };
  
  // Check if empty
  module.exports.isEmpty = function (o) {
    // Separate check for an object
    if(typeof o === 'object' && !Array.isArray(o)) {
      for(var key in o) return false; 
      return true;
    }
    return typeof o in {'null': 0, 'undefined': 0} || !o.length;
  };

  // Extend the given (`Parent`) object with `Child`;
  // override existing properties, if `flag` equals to true
  module.exports.extend = function(Parent, Child, flag) {
    for(var key in Child) {
      if((!Parent[key] && !flag) || flag) {
        Parent[key] = Child[key];
      }
    }
    return Parent;
  };
  
  // ==========================
  // Extend internal JS objects
  
  module.exports.extend(Array, {
    // Check if the given object is array
    isArray: function(o) {
      return !~o.constructor.toString().indexOf('Array');
    },
    
    // Fill array with `w`
    fill: function(a, w) {
      var len = a.length;
      for(var key = 0; key < len; ++key) {
        a[key] = w;
      }
      return a;
    }
  });
  
})();