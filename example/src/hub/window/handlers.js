/* Kumquat Hub Window Handlers
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app.handlers, {
    onItemClickHandle: function(e) {
	    var content = pl(e.target).html();
      localStorage['SelectedItem'] = content;
      ke.app.render.organize.displayCurrentItem();
    }
  });
  
})();