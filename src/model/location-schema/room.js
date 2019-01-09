'use strict';

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  roomName: {
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
  shelves: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'shelf',
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

const Room = module.exports = mongoose.model('room', roomSchema);
