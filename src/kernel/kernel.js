/* Kumquat Kernel
 * 
 * Copyright, 2012, Chernikov Alexey - http://github.com/chernikovalexey
 * 
 * Provides routing and managing of all in-extension processes,
 * a few useful APIs, such as User-storage, Web SQL DB API Wrap, Cache.
 * 
 * For its proper work requires Prevel (http://github.com/chernikovalexey/Prevel).
**/

(function(win, doc, undefined) {
  
  // PRIVATE
  
  // Common variables
  // Template for extending storages
  var ext_o_storage = {
    current: '',
    cl: [],
    list: {}
  };
  
  // Empty function
  var ef = function() {};
  
  // Do not create separate data storage for them
  var excludes = 'data,ext,ui'.split(',');
  
  // Common functions
  // Length of the given object
  // Examples: getObjectLength({a: 2, b: 3}) => 2
  var getObjectLength = function(o) {
    if(pl.type(o, 'obj')) {
      var l = 0;
      for(var key in o) {
        ++l;
      }
      return l;
    } else {
      return o.length;
    }
  };
  
  // ======
  // PUBLIC
  
  // Extend window with `ke`
  // General structure of `ke`; 
  // perhaps, some properties will be reassigned
  win.ke = {
    data: {},     // Data container
    
    app: {},      // Object with mvc of the current hub
    ui: {},       // User-Interface
    
    import: {},   // Import given script/style
    
    ext: {},      // Object with user-created extensions
    db: {},       // Wrapper for Web SQL DB API
    us: {},       // User-storage with objects
    cache: {},    // Kumquat Cache API
    nav: {}       // Navigation on ordinary pages
  };
  
  for(var key in win.ke) {
    if(!~pl.inArray(key, excludes)) {
      ke.data[key] = {};
    }
  }
  
  /* Module: import
   * (inherently, it's an analogue of `import` in Java)
   * 
   * Provides:
   *  - Organizing queues of files to be loaded;
   *  - Loading queue after Dom ready;
   *  - Supports .js and .css;
   *  - Storing history of loaded files;
   *  - Reacting with firing callback when queue is loaded.
  **/
  
  ke.import = (function() {
    return function(src, sub) {
      return new ke.import.add(src, sub);
    };
  })();
  
  pl.extend(ke.import, {
    ready: [],
    
    // Prefix before the path to file (e.g. root:kernel.kernel)
    // Now root is the only supported prefix
    get prefix() {
      return ~pl.inArray(ke.section, ke.data.kernel.save.internal_pages) ? ke.getConst('ROOT_PREFIX') : '';
    },
    
    // JS or CSS
    parseType: function(src) {
      src = src.replace(/\./g, '/');
      return src.substring(0, 2) === ke.getConst('STYLE_PREFIX') ? 
        src.substring(2) + '.css' :
        src + '.js';
    },
    
    addRes: function(src) {
      var prefix = '';
      var slash = '/';
      
      if(src.substring(0, 5) === ke.getConst('ROOT_PREFIX')) {
        prefix = ke.pathToExt;
        slash  = '';
        src    = src.substring(5);
      }
      
      return prefix + (src.substr(src.length - 4) === '.css' ? slash + 'resources/styles/' : slash + 'src/') + src;
    },
    
    add: function(src, sub) {
      src = ke.import.prefix + src;
      
      var root = src.substring(0, 5) === ke.getConst('ROOT_PREFIX');
      
      src = ke.import.addRes( ke.import.parseType(src) );
      
      if(pl.type(sub, 'undef')) {
        var parts = src.split('/');
        sub = [parts.pop()];
        src = parts.join('/') + '/';
      } else {
        src = src.replace(/\*\.(js|css)/, '');
        sub = pl.map(sub, function(e) {
          return ke.import.parseType(e);
        });
      }
      
      var parent = src.split('/')[root ? 4 : 2];
      pl.each(sub, function(k, v) {
        if(~pl.inArray(v, ke.data.import.loaded)) {
          return;
        }
        
        if(ke.deploy[parent]) {
          ke.deploy[parent].before(v.split('.')[0], src.split('/').splice(-2, 1)[0]);
        } else {
          // Define as an empty function, because it will fired a bit later
          // (to prevent errors)
          ke.deploy[parent] = {after: ef};
        }
        
        ke.import.ready.push(0);
        
        // Root access to files is needed when current section equals to 'content',
        // so it is impossible to load js in the habitual way (they won't be content scripts,
        // because Chrome allows to load content scripts from the manifest file only, 
        // that's beforehand).
        if(root) {
          pl.ajax({
            url: src + v,
            type: 'GET',
            success: function(data) {
              win.eval(data);
              ke.deploy[parent].after(v.split('.')[0], src.split('/').splice(-2, 1)[0]);
              ke.import.ready.pop();
            }
          });
        } else {
          pl.attach({
            url: src + v,
            load: function(u) {            
              ke.data.import.loaded.push(
                !pl.empty(ke.data.import.queue_name) ? 
                  [ke.data.import.queue_name, u] : 
                  u
              );
              ke.deploy[parent].after(v.split('.')[0], src.split('/').splice(-2, 1)[0]);
              ke.import.ready.pop();
            }
          });
        }
      });
            
      return ke.import;
    },
    
    // Optional for import: fire callback when everything is loaded
    onDone: function(callback) {
      var int = setInterval(function() {
        if(pl.empty(ke.import.ready)) {
          clearInterval(int);
          callback && callback();
        }
      }, 1);
    },
    
    // Loaded files as an array
    getLoaded: function() {
      return ke.data.import.loaded;
    }
  });
  
  /* Module: data
   * (based on basic objects)
   * 
   * Provides storing:
   *  - kernel settings;
   *  - current flags (dom loaded, ...);
   *  - user containers (`ke.storage`).
  **/
  
  pl.extend(ke.data.import, {
    loaded: []
  });
  
  pl.extend(ke.data.db, ext_o_storage);
  pl.extend(ke.data.us, ext_o_storage);
  
  pl.extend(ke.data, {
    
    // Kernel storage
    kernel: {
      'const': {
        STYLE_PREFIX: 's:',
        ROOT_PREFIX: 'root:',
        KERNEL_DB: 'KE_Kernel',
        CACHE_TABLE: 'Cache'
      },
      
      flags: {
        dom_loaded: false
      },
      
      info: {
        url: doc.location.href,
        ver: navigator.appVersion.match('Chrome/([0-9\.]+)')[1],
        lang: navigator.language,
        id: chrome.i18n.getMessage('@@extension_id')
      },
      
      // Public kernel data
      save: {
        stack: [],
        internal_pages: ['content']
      }
    }
  });
    
  pl.extend(ke.data.kernel.info, {
    section: ke.data.kernel.info.url.match('chrome-extension://') ? 
      ke.data.kernel.info.url.match(/([A-z0-9]+)\.html/)[1] : 
      'content'
  });

  /* Public kernel functions and getters
   * 
  **/
  
  pl.extend(ke, {
    
    // Main init
    init: function() {
      // Flags
      ke.setFlagTrue('dom_loaded');
      
      // Get and execute additional init
      ke.import('kernel.init').onDone(function() {
        ke.data.kernel.save.user_init();
      });
      
      // Fire functions
      ke.stack('run');
      ke.loadCurrentHub();
      
      // Deploy Kernel DB environment
      ke.db.choose(ke.getConst('KERNEL_DB'));
      ke.db.execSql('SELECT * FROM ?', [ke.getConst('CACHE_TABLE')], null, function() {
        ke.db.execSql('CREATE TABLE ' + ke.getConst('CACHE_TABLE') + ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, timestamp DATETIME, name VARCHAR(255), data TEXT)', [], null, null);
      });
    },
    
    // Functions which should be fired after dom loaded
    // Note: FIFO type of storing
    stack: function(flag, fn, args) {
      args = args || [];
      args = args.shift ? args : [args];
      
      if(flag === 'push') {
        ke.data.kernel.save.stack.push([fn, args]);
      } else if(flag === 'run') {
        pl.each(ke.data.kernel.save.stack, function(k, v) {
          v[0].apply(ke, v[1]);
          ke.data.kernel.save.stack.splice(k, 1);
        });
      }
    },
    
    get section() {
      return ke.data.kernel.info.section;
    },
    
    get extID() {
      return ke.data.kernel.info.id;
    },
    
    // Where `chrome.extension.getURL` does not approach
    get pathToExt() {
      return 'chrome-extension://' + ke.extID + '/';
    },
    
    getFlag: function(n) {
      return ke.data.kernel.flags[n];
    },
    
    // Create a new flag, if it does not exist
    createFlag: function(n, def_val) {
      if(pl.type(ke.data.kernel.flags[n], 'undef')) {
        ke.data.kernel.flags[n] = !pl.type(def_val, 'undef') ? def_val : false;
      }
    },
    
    setFlagTrue: function(n) {
      ke.data.kernel.flags[n] = true;
    },
    
    setFlagFalse: function(n) {
      ke.data.kernel.flags[n] = false;
    },
    
    getConst: function(n) {
      return ke.data.kernel['const'][n];
    },
    
    loadCurrentHub: function() {
      ke.import('hub.' + ke.section + '.*', ['router', 'render', 'handlers']).onDone(function() {       
        pl.each(ke.app.import || [], function(k, v) {
          ke.import(v);
        });
        
        ke.app.init();
      });
    },
    
    // Two variants which fires..:
    //  - before loading the script/style
    //  - after its loading
    deploy: {
      hub: {
        before: function(n) {
          if(n === 'router') {
            pl.extend(ke.app, {
              render: {},    // Attach events, organize ui
              handlers: {},  // Function called by events, render
            });
          }
        },
        
        after: ef
      },
      
      ext: {
        before: function(n, prev) {
          if(prev !== 'ext') {
            ke.ext[prev] = ke.ext[prev] || {};
            ke.ext[prev][n] = {};
          } else {
            ke.ext[n] = {};
          }
        },
        
        after: function(n, prev) {
          pl.each((ke.ext[prev] ? ke.ext[prev][n].import : ke.ext[n].import) || [], function(k, v) {
            ke.import(v);
          });
        }
      },
      
      // UI is not ready yet, but let it be here...
      ui: {
        before: ef,
        after: ef
      }
    }
  });
  
  /* Module: db
   * (useful api for web sql database)
   * 
   * Provides:
   *  - Adding new databases
   *  - Executing requests to the selected db
   *  - Deleting db
  **/
  
  pl.extend(ke.db, {
    choose: function(name, size) {
      ke.data.db.current = name;
      
      var db = openDatabase(name, '1.0.0', name + ' database', size || 5 * Math.pow(1024, 2));
      
      if(!db) {
        pl.error('Could not create the database.');
      }
      
      ke.data.db.list.__defineGetter__(name, function() {
        var db = openDatabase(name, '1.0.0', name + ' database', size || 5 * Math.pow(1024, 2));
        
        if(!db) {
          pl.error('Could not connect to the database.');
        }
        
        return db;
      });
    },
    
    get selected() {
      return ke.data.db.current;
    },
    
    get currentDb() {
      return !pl.empty(ke.data.db.list) ? 
        ke.data.db.list[ke.data.db.current] : 
        null;
    },
        
    execSql: function(req, s, o, f) {
      ke.db.currentDb.transaction(function(tx) {
        tx.executeSql(req, s, o, f);
      });
    }
  });
  
  /* Module: us
   * (instant type of storage based on objects)
   * 
   * Provides:
   *  - Selecting storage to work with;
   *  - Pushing new data to the selected storage;
   *  - Getting last element of the storage;
   *  - Getting first element of the storage;
   *  - Getting arbitrary element of the storage;
   *  - Deleting it (storage).
  **/
  
  // Init the default storage - with an empty key
  ke.data.us.list[ke.data.us.current] = [];
  
  var _in = function(n, msg) {
    if(pl.type(msg, 'undef')) {
      msg = n;
      n = ke.data.us.current;
    }
    ke.data.us.list[n] = ke.data.us.list[n] || [];
    ke.data.us.list[n][this](msg);
  };
  
  pl.extend(ke.us, {
    choose: function(n) {
      if(pl.type(ke.data.us.list[n], 'undef')) {
        ke.data.us.list[n] = [];
      }
      ke.data.us.cl.push(n);
      ke.data.us.current = n;
    },
    
    // Default key = empty key
    chooseDefault: function() {
      ke.us.choose('');
    },
    
    choosePrev: function() {
      ke.us.choose(ke.data.us.cl.pop());
    },
    
    push: function() {
      _in.apply('push', arguments);
    },
    
    unshift: function() {
      _in.apply('unshift', arguments);
    },
    
    pop: function(n) {
      return ke.data.us.list[n || ke.data.us.current].pop();
    },
    
    shift: function(n) {
      return ke.data.us.list[n || ke.data.us.current].shift();
    },
    
    get: function(n, index) {
      if(pl.type(index, 'undef')) {
        index = n;
        n = ke.data.us.current;
      }
      var us = ke.data.us.list[n];
      return us[index === 'first' ? 0 : (index === 'last' ? us.length - 1 : index)] || null;
    },
    
    pluck: function(n, from, to) {
      return ke.data.us.list[n || ke.data.us.current].splice(from, pl.type(to, 'undef') ? 1 : to);
    },
    
    each: function(n, fn) {
      if(pl.type(fn, 'undef')) {
        fn = n;
        n = ke.data.us.current;
      }
      
      var alias = ke.data.us.list[n]; // To prevent changes in `ke.data.us.list`
      pl.each(alias.reverse(), function(k, v) {
        fn(v, k);
      });
    },
    
    length: function(n) {
      return getObjectLength((ke.data.us.list[n || ke.data.us.current] || {}));
    },
    
    empty: function(n) {
      ke.data.us.list[n || ke.data.us.current] = [];
    }
  });
  
  /* Module: cache
   * (long-term cache based on Web SQL DB)
   * 
   * Provides:
   *  - Saving;
   *  - Getting;
   *  - Updating;
   *  - Removing elements;
   *  - Purging the whole cache;
   *  - Going through the cache using `each`.
  **/
  
  // Data, at first
  pl.extend(ke.data.cache, {
    table: ke.getConst('CACHE_TABLE')
  });
  
  pl.extend(ke.cache, {    
    chooseDb: function() {
      ke.db.choose(ke.getConst('KERNEL_DB'));
    },
    
    save: function(n, msg) {
      this.chooseDb();
      ke.db.execSql(
        'INSERT INTO ' + ke.data.cache.table + ' (timestamp, name, data) VALUES(?, ?, ?)', 
        [Date.now(), n, msg],
        null, null
      );
    },
    
    get: function(id, callback) {
      this.chooseDb();
      ke.db.execSql(
        'SELECT * FROM ' + ke.data.cache.table + ' WHERE ' + (pl.type(id, 'str') ? 'name' : 'id') + ' = ? ORDER by id DESC',
        [id],
        function(tx, res) {
          var r = [];
          var len = res.rows.length;
          for(var key = 0; key < len; ++key) {
            r.push(res.rows.item(key));
          }
          
          r = r.length === 1 ? r[0] : r;
          callback(r);
        },
        null
      );
    },
    
    update: function(n, msg) {
      this.chooseDb();
      
      ke.db.execSql(
        'UPDATE ' + ke.data.cache.table + ' SET data = ? WHERE ' + (pl.type(n, 'str') ? 'name' : 'id') + ' = ?',
        [msg, n],
        null, null
      );
    },
    
    clean: function() {
      this.chooseDb();
      ke.db.execSql(
        'DELETE FROM ' + ke.data.cache.table,
        [],
        null, null
      );
    },
    
    remove: function(id) {
      this.chooseDb();
      ke.db.execSql(
        'DELETE FROM ' + ke.data.cache.table + ' WHERE ' + (pl.type(id, 'str') ? 'name' : 'id') + ' = ?',
        [id],
        null, null
      );
    },
    
    each: function(fn) {
      this.chooseDb();
      ke.db.execSql(
        'SELECT * FROM ' + ke.data.cache.table + ' ORDER by id DESC',
        [],
        function(tx, res) {
          var len = res.rows.length;
          var d = null;
          for(var key = 0; key < len; ++key) {
            d = res.rows.item(key);
            fn(d.name, d.data, d.id, d.timestamp);
          }
        },
        null
      );
    }
  });
  
  /* Module: nav
   * (navigation between ordinary pages)
   * 
   * Provides:
   *  - Redirecting to the given page.
  **/
  
  pl.extend(ke.nav, {
    go: function(pagename, delay) {
      setTimeout(function() {
        doc.location = '/pages/public/' + pagename;
      }, delay || 0);
    }
  });
  
  // Fire init when dom loaded
  pl(ke.init);
  
})(this, document);