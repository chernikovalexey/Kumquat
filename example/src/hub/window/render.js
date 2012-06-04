/* Kumquat Hub Window Render
 * 
**/

(function(undefined) {
  
  pl.extend(ke.app.render, {
    organize: {
      displayCurrentItem: function() {
        var text;

        if (pl.type(localStorage['SelectedItem'], 'undef')) {
          text = 'Nothing is selected..';
        } else {
          text = ke.ext.tpl.compile('Item #<%=item%> is selected', {
            item: localStorage['SelectedItem']
          });
        }

        pl('.selected-indicator').html(text);
      },

      displayItems: function() {
        for (var i = 1; i <= 10; ++i) {
          var item = pl('<div>').addClass('item').html(i).get();
          pl('.items').append(item);
        }
      }
    },

    events: {
      onItemClick: function() {
        pl('.item').bind('click', ke.app.handlers.onItemClickHandle);
      }
    }
  });
  
})();