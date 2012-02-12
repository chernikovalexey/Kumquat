/* Kumquat Ext Kernel
 * 
**/

(function(win, doc, undefined) {
  
  // Common variables
  // Template for extending storages
  var ext_o_storage = {
    current: '',
    list: {}
  };
  
  // Empty function
  var ef = function() {};
  
  // Extend window with `ke`
  // General structure of `ke`; 
  // perhaps, some properties will be reassigned
  win.ke = {
    data: {},     // data container
    
    app: {},      // object with mvc of the current hub
    ui: {},       //
    
    import: {},   // import given script/style
    
    lib: {},      // Computes length of the object
    ext: {},      // object with user-created extensions
    db: {},       // 
    us: {},       // 
    cache: {},
    nav: {}
  };
  
  for(var key in win.ke) {
    if(key !== 'data') {
      ke.data[key] = {};
    }
  }
  
  /* Module: import
   * (inherently, it's an analogue of `import` in Java)
   * 
   * Provides:
   *  - Organizing queues of files to be loaded;
   *  - Loading queue after Dom ready;
   *  - Support .js and .css;
   *  - Storing history of loaded files.
  **/
  
  ke.import = (function() {
    return function(src, sub) {
      return new ke.import.add(src, sub);
    };
  })();
  
  pl.extend(ke.import, {
    ready: [],
    
    // Now root is the only supported prefix
    get prefix() {
      return ~pl.inArray(ke.section, ke.data.kernel.save.internal_pages) ? ke.getConst('ROOT_PREFIX') : '';
    },
    
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
      ke.setFlagTrue('import_works');
      
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
          ke.deploy[parent].before(v.split('.')[0]);
        } else {
          // Define as an empty function, because it will fired a bit later
          // (to prevent errors)
          ke.deploy[parent] = {after: ef};
        }
        
        ke.import.ready.push(0);
        if(root) {
          pl.ajax({
            url: src + v,
            type: 'GET',
            success: function(data) {
              window.eval(data);
              ke.deploy[parent].after(v.split('.')[0]);
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
              ke.deploy[parent].after(v.split('.')[0]);
              ke.import.ready.pop();
            }
          });
        }
      });
            
      return ke.import;
    },
    
    onDone: function(callback) {
      var int = setInterval(function() {
        if(pl.empty(ke.import.ready)) {
          clearInterval(int);
          callback && callback();
        }
      }, 1);
    },
    
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
        dom_loaded: false,
        import_works: false
      },
      
      info: {
        url: document.location.href,
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

  /* 
   * Public kernel functions
  **/
  
  pl.extend(ke, {
    init: function() {
      // Flags
      ke.setFlagTrue('dom_loaded');
      
      // Fire functions
      ke.stack('run');
      ke.loadCurrentHub();
      
      // Deploy Kernel DB environment
      ke.db.choose(ke.getConst('KERNEL_DB'));
      ke.db.execSql('SELECT * FROM ?', [ke.getConst('CACHE_TABLE')], null, function() {
        ke.db.execSql('CREATE TABLE ' + ke.getConst('CACHE_TABLE') + ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, timestamp DATETIME, name VARCHAR(255), data TEXT)', [], null, null);
      });
      
      ke.import('kernel.init').onDone(function() {
        ke.data.kernel.save.user_init();
      });
    },
    
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
    
    get pathToExt() {
      return 'chrome-extension://' + ke.extID + '/';
    },
    
    getFlag: function(n) {
      return ke.data.kernel.flags[n];
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
    
    // Two variants which fires:
    //  - before loading the script/style
    //  - after its loaded
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
        before: function(n) {
          ke.ext[n] = {};
        },
        
        after: function(n) {
          pl.each(ke.ext[n].import || [], function(k, v) {
            ke.import(v);
          });
        }
      },
      
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
   * 
  **/
  
  pl.extend(ke.us, {
    choose: function(n) {
      if(pl.type(ke.data.us.list[n], 'undef')) {
        ke.data.us.list[n] = [];
      }
      
      ke.data.us.current = n;
    },
    
    push: function(msg) {
      ke.data.us.list[ke.data.us.current].push(msg);
    },
    
    pop: function() {
      return ke.data.us.list[ke.data.us.current].pop();
    },
    
    shift: function() {
      return ke.data.us.list[ke.data.us.current].shift();
    },
    
    get: function(index) {
      var us = ke.data.us.list[ke.data.us.current];
      return us[index === 'first' ? 0 : (index === 'last' ? us.length - 1 : index)] || null;
    },
    
    length: function(n) {
      return ke.lib.getLength((ke.data.us.list[ke.data.us.current] || {}));
    },
    
    empty: function() {
      ke.data.us.list[ke.data.us.current] = [];
    },
    
    'delete': function() {
      var c = ke.data.us.current;
      ke.data.us.current = '';
      delete ke.data.us.list[ke.data.us.current];
    }
  });
  
  /* Module: cache
   * 
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
   * 
  **/
  
  pl.extend(ke.nav, {
    go: function(pagename, delay) {
      setTimeout(function() {
        document.location = '/pages/public/' + pagename;
      }, delay || 0);
    }
  });
  
  /* Module: lib
   * (a few useful functions)
  **/
  
  pl.extend(ke.lib, {
    getLength: function(o) {
      if(pl.type(o, 'obj')) {
        var l = 0;
        for(var key in o) {
          ++l;
        }
        return l;
      } else {
        return o.length;
      }
    }
  });

  // Fire init when don loaded
  pl(ke.init);
  
})(this, document);