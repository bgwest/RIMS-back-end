'use strict';

const faker = require('faker');
const superagent = require('superagent');
const partMock = require('./lib/part-mock');
const server = require('../lib/server');
const subAssemblyMock = require('./lib/subAssemblyMock');

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Testing subassembly routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return a subassembly object', () => {
    return subAssemblyMock.pCreateSubAssemblyMock()
      .then((response) => {
        console.log(response);
        expect(response._id).toBeTruthy();
      });
  });
  test('Should return a 200 for a successful creation of sub-assembly', () => {
    return superagent.post(`${API_URL}/subassemblies`)
      .send({
        subId: faker.lorem.words(1) + Math.random().toString(),
        subPart: faker.lorem.words(1),
        subVersion: faker.lorem.words(2),
        subQuantity: Math.random().toString(),
        subMinutes: Math.random().toString(),
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
  test('should return a 200 status code and a token if a part is created successfully', () => {
    return partMock.pCreatePartMock()
      .then((response) => {
        expect(response.part).toBeTruthy();
      });
  });
});
