/*
 * 
**/

(function(undefined) {
  
  pl.extend(ke.ext.log, {
    'do': function() {
      console.log.apply(console, arguments);
    }
  });
  
})();