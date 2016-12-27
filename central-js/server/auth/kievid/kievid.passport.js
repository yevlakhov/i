var kyividService = require('./kievid.service');

exports.setup = function (config, authProviderRegistry) {
  authProviderRegistry.use('kyivid', kyividService);
};
