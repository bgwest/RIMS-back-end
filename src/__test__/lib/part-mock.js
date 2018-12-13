'use strict';

const faker = require('faker');
const subAssemblyMock = require('./subAssemblyMock');
const Part = require('../../model/part');


const partMock = module.exports = {};

partMock.pCreatePartMock = () => {
  const resultMock = {};

  return subAssemblyMock.pCreateSubAssemblyMock()
    .then((createdSubAssemblyMock) => {
      resultMock.subAssembly = createdSubAssemblyMock;

      return new Part({
        partId: (Math.random() * 100000).toString(),
        partDescription: faker.lorem.words(5),
        partSub: true,
        partSrc: faker.lorem.words(2),
        partMfgNum: Math.random().toString(),
        partPrice: Math.random().toString(),
        partCategory: faker.lorem.words(3),
        partLocation: faker.lorem.words(3),
        partCount: Math.random().toString(),
        partLongLead: false,
        partNotes: faker.lorem.words(3),
        // subAssembly: createdSubAssemblyMock._id,
        // subIDRef: faker.lorem.words(1),
      }).save();
    })
    .then((createdPartMock) => {
      resultMock.part = createdPartMock;
      return resultMock;
    });
};

partMock.pCleanPartMocks = () => {
  return Promise.all([
    Part.remove({}),
    subAssemblyMock.pCleanSubAssemblyMocks(),
  ]);
};
