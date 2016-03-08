"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keychain = function () {
  function Keychain() {
    _classCallCheck(this, Keychain);
  }

  Keychain.prototype.setSubscribeKey = function setSubscribeKey(subscribeKey) {
    this._subscribeKey = subscribeKey;
    return this;
  };

  Keychain.prototype.setPublishKey = function setPublishKey(publishkey) {
    this._publishKey = publishkey;
    return this;
  };

  Keychain.prototype.setAuthKey = function setAuthKey(authKey) {
    this._authKey = authKey;
    return this;
  };

  Keychain.prototype.getSubscribeKey = function getSubscribeKey() {
    return this._subscribeKey;
  };

  Keychain.prototype.getPublishKey = function getPublishKey() {
    return this._publishKey;
  };

  Keychain.prototype.getAuthKey = function getAuthKey() {
    return this._authKey;
  };

  return Keychain;
}();

module.exports = Keychain;
//# sourceMappingURL=keychain.js.map
