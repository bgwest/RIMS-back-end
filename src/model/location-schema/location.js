'use strict';

const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  // !Tom - adding the required line in case we want to make location required later
  // !Tom - locationName is how the customer would name their locations, not necessarily
  //        how they are sorted under the hood. Still figuring out how to do that on our end
  locationName: {
    type: String,
    unique: true,
    required: false,
  },
  rooms: [
    {
      type: mongoose.Schema.types.ObjectId,
      ref: 'room',
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
      ref: 'item',
    },
  ],
});

const Location = module.exports = mongoose.model('location', locationSchema);
