const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('creates', () => {
  describe('send message create', () => {
    it('should send a message', async () => {
      const bundle = {
        authData: {
          api_token: process.env.API_TOKEN || 'test_token'
        },
        inputData: {
          recipient_mobile: '9799605400',
          message: 'Test message from Zapier',
          recipient_name: 'Test User',
          channel: '7891976320'
        }
      };

      const result = await appTester(App.creates.sendMessage.operation.perform, bundle);
      result.should.have.property('success');
    });
  });

  describe('send template message create', () => {
    it('should send a template message', async () => {
      const bundle = {
        authData: {
          api_token: process.env.API_TOKEN || 'test_token'
        },
        inputData: {
          recipient_mobile: '9799605400',
          template_id: '281',
          country_id: 98,
          variables: 'John,Doe'
        }
      };

      const result = await appTester(App.creates.sendTemplateMessage.operation.perform, bundle);
      result.should.have.property('success');
    });
  });
});
