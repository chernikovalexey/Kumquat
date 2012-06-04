/* Kumquat Extension - String
 * 
**/

(function(undefined) {
  
  // Get contents of the script
  var script_regex = '<script[^>]*>([\\S\\s]*?)<\/script>';
  
  pl.extend(ke.ext.string, {
    // Replace html entities with their unrendered variants
    escapeHtml: function(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    
    // Replace unrendered html entities with their rendered variants
    acquireHtml: function(str) {
      return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    },

    // Get contents of all possible in the given string scripts
    getScripts: function(str) {
      var match_all = new RegExp(script_regex, 'img'),
          match_one = new RegExp(script_regex, 'im');
      
      return pl.map(str.match(match_all) || [], function(script_tag) {
        return (script_tag.match(match_one) || ['', ''])[1];
      });
    },
    
    // Execute scripts from the given string
    execScripts: function(str) {
      pl.each(ke.ext.string.getScripts(str), function(k, script) {
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