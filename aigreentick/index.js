const packageJson = require('./package.json');
const zapier = require('zapier-platform-core');

const authentication = require('./authentication');
const triggers = require('./triggers/index');
const creates = require('./creates/index.js');
const { getTemplates, getCountries } = require('./resources');
const { templatesSearch, countriesSearch } = require('./searches');

// Debug logging to identify undefined modules
console.log('=== DEBUGGING MODULE IMPORTS ===');
console.log('triggers.newIncomingMessage:', triggers.newIncomingMessage);
console.log('triggers.newContact:', triggers.newContact);
console.log('creates.sendMessage:', creates.sendMessage);
console.log('creates.sendTemplateMessage:', creates.sendTemplateMessage);
console.log('creates.sendMediaMessage:', creates.sendMediaMessage);
console.log('creates.broadcastMessage:', creates.broadcastMessage);
console.log('getTemplates:', getTemplates);
console.log('getCountries:', getCountries);
console.log('templatesSearch:', templatesSearch);
console.log('countriesSearch:', countriesSearch);
console.log('=== END DEBUG ===');

// Function to check if a module has valid inputFields
const checkInputFields = (moduleName, module) => {
  if (module && module.operation && module.operation.inputFields) {
    const fields = module.operation.inputFields;
    fields.forEach((field, index) => {
      if (!field) {
        console.error(`ERROR: ${moduleName} has undefined field at index ${index}`);
      } else if (field.hidden === undefined && field.type === 'boolean') {
        console.warn(`WARNING: ${moduleName} field '${field.key}' might be missing 'hidden' property`);
      }
    });
  }
};

// Check all modules for input field issues
if (triggers.newIncomingMessage) checkInputFields('newIncomingMessage', triggers.newIncomingMessage);
if (triggers.newContact) checkInputFields('newContact', triggers.newContact);
if (creates.sendMessage) checkInputFields('sendMessage', creates.sendMessage);
if (creates.sendTemplateMessage) checkInputFields('sendTemplateMessage', creates.sendTemplateMessage);
if (creates.sendMediaMessage) checkInputFields('sendMediaMessage', creates.sendMediaMessage);
if (creates.broadcastMessage) checkInputFields('broadcastMessage', creates.broadcastMessage);

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
    [creates.sendTemplateMessage.key]: creates.sendTemplateMessage,
    [creates.sendMediaMessage.key]: creates.sendMediaMessage,
    [creates.broadcastMessage.key]: creates.broadcastMessage,
  },

  resources: {
    [getTemplates.key]: getTemplates,
    [getCountries.key]: getCountries,
  },

  searches: {
    [templatesSearch.key]: templatesSearch,
    [countriesSearch.key]: countriesSearch,
  },
};