/* @flow */

import Networking from '../components/networking';

export default class {

  _networking: Networking.;

  constructor(networking: typeof Networking) {
    this._networking = networking;
  }

  fetchHistory(args: Object, callback: Function) {
    var callback = args['callback'] || callback;
    var count = args['count'] || args['limit'] || 100;
    var reverse = args['reverse'] || 'false';
    var err = args['error'] || function () {};
    var auth_key = args['auth_key'] || AUTH_KEY;
    var cipher_key = args['cipher_key'];
    var channel = args['channel'];
    var channel_group = args['channel_group'];
    var start = args['start'];
    var end = args['end'];
    var include_token = args['include_token'];
    var string_msg_token = args['string_message_token'] || false;
    var params = {};
    var jsonp = jsonp_cb();

    this._networking

    // Make sure we have a Channel
    if (!channel && !channel_group) return error('Missing Channel');
    if (!callback) return error('Missing Callback');
    if (! this._networking.getSubscribeKey()) return error('Missing Subscribe Key');

    params['stringtoken'] = 'true';
    params['count'] = count;
    params['reverse'] = reverse;
    params['auth'] = auth_key;

    if (channel_group) {
      params['channel-group'] = channel_group;
      if (!channel) {
        channel = ',';
      }
    }
    if (jsonp) params['callback'] = jsonp;
    if (start) params['start'] = start;
    if (end) params['end'] = end;
    if (include_token) params['include_token'] = 'true';
    if (string_msg_token) params['string_message_token'] = 'true';

    this._networking.

    // Send Message
    this._networking.fetchHistory(channel, {
      callback: jsonp,
      data: _get_url_params(params),
      success: function (response) {
        if (typeof response == 'object' && response['error']) {
          err({ message: response['message'], payload: response['payload'] });
          return;
        }
        var messages = response[0];
        var decrypted_messages = [];
        for (var a = 0; a < messages.length; a++) {
          if (include_token) {
            var new_message = decrypt(messages[a]['message'], cipher_key);
            var timetoken = messages[a]['timetoken'];
            try {
              decrypted_messages.push({ message: JSON.parse(new_message), timetoken: timetoken });
            } catch (e) {
              decrypted_messages.push(({ message: new_message, timetoken: timetoken }));
            }
          } else {
            var new_message = decrypt(messages[a], cipher_key);
            try {
              decrypted_messages.push(JSON.parse(new_message));
            } catch (e) {
              decrypted_messages.push((new_message));
            }
          }
        }
        callback([decrypted_messages, response[1], response[2]]);
      },
      fail: function (response) {
        _invoke_error(response, err);
      }
    });
  }

}