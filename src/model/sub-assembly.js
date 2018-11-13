'use strict';

const mongoose = require('mongoose');

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

const subAssembly = module.exports = mongoose.model('subAssembly', subAssemblySchema);

subAssembly.create = (subId, subPart, subVersion, subQuantity, subMinutes) => {
  console.log(subId);
  return new subAssembly({
    subId,
    subPart,
    subVersion,
    subQuantity,
    subMinutes,
  }).save();
};
