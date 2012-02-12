/* Kumquat Extension - Html
 * 
**/

(function(undefined) {
  
  var script_regex = '<script[^>]*>([\\S\\s]*?)<\/script>';
  
  pl.extend(ke.ext.html, {
    escapeHtml: function(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    
    acquireHtml: function(str) {
      return ke.ext.html.stripTags(str)
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    },

    getScripts: function(str) {
      var match_all = new RegExp(script_regex, 'img'),
          match_one = new RegExp(script_regex, 'im');
      
      return pl.map(str.match(match_all) || [], function(script_tag) {
        return (script_tag.match(match_one) || ['', ''])[1];
      });
    },
    
    execScripts: function(str) {
      pl.each(ke.ext.html.getScripts(str), function(k, script) {
        window.eval(script);
      });
    },
    
    removeTags: function(str) {
      return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    },
    
    removeScripts: function(str) {
      return str.replace(new RegExp(script_regex, 'img'), '');
    }
  });
  
})();