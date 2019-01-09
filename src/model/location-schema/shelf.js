'use strict';

const mongoose = require('mongoose');

const shelfSchema = mongoose.Schema({
  shelfName: {
    type: String,
    unique: true,
    required: false,
  },
  locations: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'location',
    },
  ],
  aisles: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'aisle',
    },
  ],
  rooms: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'room',
    },
  ],
  bins: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'bin',
    },
  ],
  items: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'room',
    },
  ],
});

const Shelf = module.exports = mongoose.model('shelf', shelfSchema);
