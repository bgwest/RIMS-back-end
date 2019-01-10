'use strict';

const mongoose = require('mongoose');

const binSchema = mongoose.Schema({
  binName: {
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
  shelves: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'shelf',
    },
  ],
  items: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'item',
    },
  ],
});

const Bin = module.exports = mongoose.model('bin', binSchema);
