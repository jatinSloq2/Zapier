const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('authentication', () => {
  it('should authenticate', async () => {
    const bundle = {
      authData: {
        api_token: process.env.API_TOKEN || 'test_token'
      }
    };

    const result = await appTester(App.authentication.test, bundle);
    result.should.have.property('data');
    result.data.should.have.property('user');
  });
});