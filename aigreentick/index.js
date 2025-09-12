const packageJson = require('./package.json');
const zapier = require('zapier-platform-core');
const authentication = require('./authentication');
const triggers = require('./triggers/index');
const creates = require('./creates/index.js');
const { getTemplates } = require('./resources');


module.exports = {
  version: packageJson.version,
  platformVersion: zapier.version,
  authentication,
  triggers: {
    [triggers.newIncomingMessage.key]: triggers.newIncomingMessage,
    [triggers.newContact.key]: triggers.newContact,
  },

  creates: {
    [creates.sendMessage.key]: creates.sendMessage,
    [creates.broadcastMessage.key]: creates.broadcastMessage,
    [creates.createContact.key]: creates.createContact,
  },

  resources: { [getTemplates.key]: getTemplates },

  searches: {},
};