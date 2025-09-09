const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('triggers', () => {
  describe('new incoming message trigger', () => {
    it('should load messages', async () => {
      const bundle = {
        authData: {
          api_token: process.env.API_TOKEN || 'test_token'
        },
        inputData: {}
      };

      const results = await appTester(App.triggers.newIncomingMessage.operation.perform, bundle);
      results.should.be.an.Array();
    });
  });

  describe('new contact trigger', () => {
    it('should load contacts', async () => {
      const bundle = {
        authData: {
          api_token: process.env.API_TOKEN || 'test_token'
        },
        inputData: {}
      };

      const results = await appTester(App.triggers.newContact.operation.perform, bundle);
      results.should.be.an.Array();
    });
  });
}); 