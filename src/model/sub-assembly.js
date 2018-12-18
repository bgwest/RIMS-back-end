'use strict';

const mongoose = require('mongoose');
// const Part = require('./part');

const subAssemblySchema = mongoose.Schema({
  subId: {
    type: String,
    unique: true,
    required: true,
  },
  subPart: {
    type: String,
    required: true,
  },
  subVersion: {
    type: String,
  },
  subQuantity: {
    type: String,
  },
  subMinutes: {
    type: String,
  },
  // TOM: This connects the subAssembly to the Parts
  parts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'part',
    },
  ],
},
{
  usePushEach: true,
});

const SubAssembly = module.exports = mongoose.model('subAssembly', subAssemblySchema);

SubAssembly.create = (subId, subPart, subVersion, subQuantity, subMinutes) => {
  return new SubAssembly({
    subId,
    subPart,
    subVersion,
    subQuantity,
    subMinutes,
  }).save();
};
