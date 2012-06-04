/* Kumquat Kernel Additional Init
 * 
 * To avoid interfering the internal work of ./kernel.js user-init (additional) is passed to
 * another file (this).
 * 
 * It might be useful, if you have something that must initialized on every page or 
 * something like that.
**/

(function(undefined) {
  
  // Will be fired along with ordinary Kernel Init
  ke.data.kernel.save.user_init = function() {
    
  };
  
})();