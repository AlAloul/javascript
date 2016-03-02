/* @flow */

/* eslint no-unused-expressions: 0, block-scoped-var: 0, no-redeclare: 0, guard-for-in: 0 */

var defaultConfiguration = require('../defaults.json');
var REPL = /{([\w\-]+)}/g;

export default class {

  static rnow() {
    return +new Date;
  }

  /**
   * ENCODE
   * ======
   * var encoded_data = encode('path');
   */
  static encode(path) { return encodeURIComponent(path); }

  static isArray(arg) {
    return !!arg && typeof arg !== 'string' && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === 'number');
    // return !!arg && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
  }

  /**
   * SUPPLANT
   * ========
   * var text = supplant( 'Hello {name}!', { name : 'John' } )
   */
  static supplant(str, values) {
    return str.replace(REPL, function (_, match) {
      return values[match] || _;
    });
  }

  /**
   * Build Url
   * =======
   *
   */
  static buildURL(urlComponents, urlParams) {
    var url = urlComponents.join(defaultConfiguration.URLBIT);
    var params = [];

    if (!urlParams) return url;

    this.each(urlParams, function (key, value) {
      var valueStr = (typeof value === 'object') ? JSON.stringify(value) : value;
      (typeof value !== 'undefined' &&
        value !== null && this.encode(valueStr).length > 0
      ) && params.push(key + '=' + this.encode(valueStr));
    });

    url += '?' + params.join(defaultConfiguration.PARAMSBIT);
    return url;
  }

  /**
   * EACH
   * ====
   * each( [1,2,3], function(item) { } )
   */
  static each(o, f) {
    if (!o || !f) {
      return;
    }

    if (this.isArray(o)) {
      for (var i = 0, l = o.length; i < l;) {
        f.call(o[i], o[i], i++);
      }
    } else {
      for (var i in o) {
        o.hasOwnProperty &&
        o.hasOwnProperty(i) &&
        f.call(o[i], i, o[i]);
      }
    }
  }

  /**
   * UPDATER
   * =======
   * var timestamp = unique();
   */
  static updater(fun, rate) {
    var timeout;
    var last = 0;
    var runnit = function () {
      if (last + rate > this.rnow()) {
        clearTimeout(timeout);
        timeout = setTimeout(runnit, rate);
      } else {
        last = this.rnow();
        fun();
      }
    };

    return runnit;
  }

  /**
   * GREP
   * ====
   * var list = grep( [1,2,3], function(item) { return item % 2 } )
   */
  static grep(list, fun) {
    var fin = [];
    this.each(list || [], function (l) {
      fun(l) && fin.push(l);
    });
    return fin;
  }

  /**
   * timeout
   * =======
   * timeout( function(){}, 100 );
   */
  static timeout(fun, wait) {
    if (typeof(setTimeout) === 'undefined') {
      return;
    }

    return setTimeout(fun, wait);
  }

  /**
   * uuid
   * ====
   * var my_uuid = generateUUID();
   */
  static generateUUID(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    if (callback) callback(u);
    return u;
  }

  /**
   * MAP
   * ===
   * var list = map( [1,2,3], function(item) { return item + 1 } )
   */
  static map(list, fun) {
    var fin = [];
    this.each(list || [], function (k, v) {
      fin.push(fun(k, v));
    });
    return fin;
  }

  static pamEncode(str) {
    return encodeURIComponent(str).replace(/[!'()*~]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
}
