'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-unused-expressions: 0, block-scoped-var: 0, no-redeclare: 0, guard-for-in: 0 */

var defaultConfiguration = require('../defaults.json');
var REPL = /{([\w\-]+)}/g;

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, null, [{
    key: 'rnow',
    value: function rnow() {
      return +new Date();
    }

    /**
     * ENCODE
     * ======
     * var encoded_data = encode('path');
     */

  }, {
    key: 'encode',
    value: function encode(path) {
      return encodeURIComponent(path);
    }
  }, {
    key: 'isArray',
    value: function isArray(arg) {
      return !!arg && typeof arg !== 'string' && (Array.isArray && Array.isArray(arg) || typeof arg.length === 'number');
      // return !!arg && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
    }

    /**
     * SUPPLANT
     * ========
     * var text = supplant( 'Hello {name}!', { name : 'John' } )
     */

  }, {
    key: 'supplant',
    value: function supplant(str, values) {
      return str.replace(REPL, function (_, match) {
        return values[match] || _;
      });
    }

    /**
     * Build Url
     * =======
     *
     */

  }, {
    key: 'buildURL',
    value: function buildURL(urlComponents, urlParams) {
      var url = urlComponents.join(defaultConfiguration.URLBIT);
      var params = [];

      if (!urlParams) return url;

      this.each(urlParams, function (key, value) {
        var valueStr = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? JSON.stringify(value) : value;
        typeof value !== 'undefined' && value !== null && this.encode(valueStr).length > 0 && params.push(key + '=' + this.encode(valueStr));
      });

      url += '?' + params.join(defaultConfiguration.PARAMSBIT);
      return url;
    }

    /**
     * EACH
     * ====
     * each( [1,2,3], function(item) { } )
     */

  }, {
    key: 'each',
    value: function each(o, f) {
      if (!o || !f) {
        return;
      }

      if (this.isArray(o)) {
        for (var i = 0, l = o.length; i < l;) {
          f.call(o[i], o[i], i++);
        }
      } else {
        for (var i in o) {
          o.hasOwnProperty && o.hasOwnProperty(i) && f.call(o[i], i, o[i]);
        }
      }
    }

    /**
     * UPDATER
     * =======
     * var timestamp = unique();
     */

  }, {
    key: 'updater',
    value: function updater(fun, rate) {
      var timeout;
      var last = 0;
      var runnit = function runnit() {
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

  }, {
    key: 'grep',
    value: function grep(list, fun) {
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

  }, {
    key: 'timeout',
    value: function timeout(fun, wait) {
      if (typeof setTimeout === 'undefined') {
        return;
      }

      return setTimeout(fun, wait);
    }

    /**
     * uuid
     * ====
     * var my_uuid = generateUUID();
     */

  }, {
    key: 'generateUUID',
    value: function generateUUID(callback) {
      var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : r & 0x3 | 0x8;
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

  }, {
    key: 'map',
    value: function map(list, fun) {
      var fin = [];
      this.each(list || [], function (k, v) {
        fin.push(fun(k, v));
      });
      return fin;
    }
  }, {
    key: 'pamEncode',
    value: function pamEncode(str) {
      return encodeURIComponent(str).replace(/[!'()*~]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
  }]);

  return _class;
}();

exports.default = _class;
//# sourceMappingURL=utils.js.map
