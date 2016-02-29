/* @flow */

import Keychain from '../components/keychain';
import Networking from '../components/networking';

export default class {

  _networking: Networking;
  _keychain: Keychain;
  _error: Function;
  _jsonpCallBack: Function;
  _invokeCallback: Function;
  _getUrlParams: Function;

  constructor(networking: Networking, keychain: Keychain,
    error: Function, jsonpCallBack: Function,
    invokeCallback: Function, getUrlParams: Function) {
    this._networking = networking;
    this._keychain = keychain;
    this._error = error;
    this._jsonpCallBack = jsonpCallBack;
    this._invokeCallback = invokeCallback;
    this._getUrlParams = getUrlParams;
  }

  /*
   PUBNUB.replay({
   source      : 'my_channel',
   destination : 'new_channel'
   });
   */
  performReplay(args: Object, dedicatedCallback: Function) {
    var callback = dedicatedCallback || args['callback'] || function () {};
    var auth_key = args['auth_key'] || this._keychain.getAuthKey();
    var source = args['source'];
    var destination = args['destination'];
    var err = args['error'] || args['error'] || function () {};
    var stop = args['stop'];
    var start = args['start'];
    var end = args['end'];
    var reverse = args['reverse'];
    var limit = args['limit'];
    var jsonp = this._jsonpCallBack();
    var data = {};

    // Check User Input
    if (!source) return this._error('Missing Source Channel');
    if (!destination) return this._error('Missing Destination Channel');
    if (!this._keychain.getPublishKey()) return this._error('Missing Publish Key');
    if (!this._keychain.getSubscribeKey()) return this._error('Missing Subscribe Key');

    // Setup URL Params
    if (jsonp !== '0') data['callback'] = jsonp;
    if (stop) data['stop'] = 'all';
    if (reverse) data['reverse'] = 'true';
    if (start) data['start'] = start;
    if (end) data['end'] = end;
    if (limit) data['count'] = limit;

    data['auth'] = auth_key;

    // Start (or Stop) Replay!
    this._networking.fetchReplay(source, destination, {
      callback: jsonp,
      success: function (response) {
        this.invokeCallback(response, callback, err);
      },
      fail: function () {
        callback([0, 'Disconnected']);
      },
      data: this._getUrlParams(data)
    });
  }

}
