/* Kumquat Hub Window Router
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app, {
    import: [
      'ext.tpl'
    ],
             
    init: function() {
      ke.app.render.organize.displayCurrentItem();
      ke.app.render.organize.displayItems();

      ke.app.render.events.onItemClick();
    }
  });
  
})();