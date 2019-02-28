'use strict';

const perms = require('../perms/perms');

module.exports = {
  admin: perms.adminPerms,
  editor: perms.editorPerms,
  viewer: perms.viewerPerms,
};
