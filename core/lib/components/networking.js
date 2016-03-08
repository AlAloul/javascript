'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keychain = require('./keychain.js');

var utils = require('../utils');

var Networking = function () {
  function Networking(xdr, keychain) {
    var ssl = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var origin = arguments.length <= 3 || arguments[3] === undefined ? 'pubsub.pubnub.com' : arguments[3];

    _classCallCheck(this, Networking);

    this._xdr = xdr;
    this._keychain = keychain;

    this._maxSubDomain = 20;
    this._currentSubDomain = Math.floor(Math.random() * this._maxSubDomain);

    this._providedFQDN = (ssl ? 'https://' : 'http://') + origin;

    // create initial origins
    this.shiftStandardOrigin(false);
    this.shiftSubscribeOrigin(false);
  }

  Networking.prototype.nextOrigin = function nextOrigin(failover) {
    // if a custom origin is supplied, use do not bother with shuffling subdomains
    if (this._providedFQDN.indexOf('pubsub.') === -1) {
      return this._providedFQDN;
    }

    var newSubDomain = void 0;

    if (failover) {
      newSubDomain = utils.generateUUID().split('-')[0];
    } else {
      this._currentSubDomain = this._currentSubDomain + 1;

      if (this._currentSubDomain >= this._maxSubDomain) {
        this._currentSubDomain = 1;
      }

      newSubDomain = this._currentSubDomain.toString();
    }

    return this._providedFQDN.replace('pubsub', 'ps' + newSubDomain);
  };

  // origin operations


  Networking.prototype.shiftStandardOrigin = function shiftStandardOrigin() {
    var failover = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this._standardOrigin = this.nextOrigin(failover);

    return this._standardOrigin;
  };

  Networking.prototype.shiftSubscribeOrigin = function shiftSubscribeOrigin() {
    var failover = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    this._subscribeOrigin = this.nextOrigin(failover);

    return this._subscribeOrigin;
  };

  // method based URL's


  Networking.prototype.fetchHistory = function fetchHistory(channel, _ref) {
    var data = _ref.data;
    var callback = _ref.callback;
    var success = _ref.success;
    var fail = _ref.fail;

    var url = [this.getStandardOrigin(), 'v2', 'history', 'sub-key', this._keychain.getSubscribeKey(), 'channel', utils.encode(channel)];

    this._xdr({ data: data, callback: callback, success: success, fail: fail, url: url });
  };

  Networking.prototype.fetchReplay = function fetchReplay(source, destination, _ref2) {
    var data = _ref2.data;
    var callback = _ref2.callback;
    var success = _ref2.success;
    var fail = _ref2.fail;

    var url = [this.getStandardOrigin(), 'v1', 'replay', this._keychain.getPublishKey(), this._keychain.getSubscribeKey(), source, destination];

    this._xdr({ data: data, callback: callback, success: success, fail: fail, url: url });
  };

  Networking.prototype.fetchTime = function fetchTime(jsonp, _ref3) {
    var data = _ref3.data;
    var callback = _ref3.callback;
    var success = _ref3.success;
    var fail = _ref3.fail;

    var url = [this.getStandardOrigin(), 'time', jsonp];

    this._xdr({ data: data, callback: callback, success: success, fail: fail, url: url });
  };

  Networking.prototype.getOrigin = function getOrigin() {
    return this._providedFQDN;
  };

  Networking.prototype.getStandardOrigin = function getStandardOrigin() {
    return this._standardOrigin;
  };

  Networking.prototype.getSubscribeOrigin = function getSubscribeOrigin() {
    return this._subscribeOrigin;
  };

  return Networking;
}();

module.exports = Networking;
//# sourceMappingURL=networking.js.map
