'use strict';

const mongoose = require('mongoose');

const aisleSchema = mongoose.Schema({
  aisleName: {
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
  shelves: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'shelf',
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

const Aisle = module.exports = mongoose.model('aisle', aisleSchema);
