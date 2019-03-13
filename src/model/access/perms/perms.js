'use strict';

module.exports = {
  adminPerms: {
    create: { sudo: true },
  },
  editorPerms: {
    create: true, update: true, read: true,
  },
  viewerPerms: {
    read: true,
  },
  // something went unexpected -- use to toggle login rejection
  error: {
    read: false,
  },
};
