(function(undefined) {
  
  // Check if the given object is array
  Array.isArray = Array.isArray || function(o) {
    return !~o.constructor.toString().indexOf('Array');
  };
  
  // Check if empty
  function isEmpty(o) {
   // Separate check for an object
    if(typeof o === 'object' && !Array.isArray(o)) {
      for(var key in o) return false; 
      return true;
    }
    return typeof o in {'null': 0, 'undefined': 0} || !o.length;
  }
  
  // Extend the given (`Parent`) object with `Child`;
  // override existing properties, if `flag` equals to true
  function extend(Parent, Child, flag) {
    for(var key in Child) {
      if((!Parent[key] && !flag) || flag) {
        Parent[key] = Child[key];
      }
    }
    return Parent;
  }
  
  module.exports.isEmpty = isEmpty;
  module.exports.extend = extend;
  
})();