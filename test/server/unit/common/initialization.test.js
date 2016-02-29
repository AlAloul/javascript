/* global describe, beforeEach, it, before, afterEach */
/* eslint no-console: 0 */

const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();
const utils = require('../../../../core/src/utils');

// temp integration test while core is still complex
describe('core initalization', () => {

  beforeEach(() => {
    sinon.stub(Math, 'random', function () {
      return 0.8;
    });

    sinon.stub(utils, 'generateUUID', function () {
      return '5f0651fc-5b92-4a3b-96ca-08eee41508bd';
    });
  });

  afterEach(() => {
    Math.random.restore();
    utils.generateUUID.restore();
  });

  it('passes the correct arguments to the networking class', () => {
    const setupConfig = {
      subscribe_key: 'subKey',
      publish_key: 'publishKey',
      auth_key: 'authKey',
      origin: 'customOrigin.origin.com',
      ssl: true,
      xdr: function () {}
    };

    let _keychain = null;

    let proxiedCore = proxyquire('../../../../core/src/pubnub-common.js', {
      './components/networking': class {
        constructor(xhr, keychain, ssl, domain) {
          _keychain = keychain;

          assert.equal(keychain.getInstanceId(), '');
          assert.equal(keychain.getAuthKey(), setupConfig.auth_key);
          assert.equal(keychain.getPublishKey(), setupConfig.publish_key);
          assert.equal(keychain.getSubscribeKey(), setupConfig.subscribe_key);
          assert.equal(ssl, setupConfig.ssl);
          assert.equal(domain, 'customOrigin.origin.com');
        }
        fetchTime() {}
      }
    });

    proxiedCore.PN_API(setupConfig);
    assert.equal(_keychain.getInstanceId(), '5f0651fc-5b92-4a3b-96ca-08eee41508bd');
  });
});
