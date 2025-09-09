import packageJson from './package.json' with { type: 'json' };
import zapier from 'zapier-platform-core';

import authentication from './authentication.js';
import triggers from './triggers/index.js';
import creates from './creates/index.js';
import { getTemplates, getCountries } from './resoures.js';
import { templatesSearch, countriesSearch } from './searches.js';

export default {
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