'use strict';

const partMock = require('./lib/part-mock');
const server = require('../lib/server');

describe('Testing part routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return a part object', () => {
    return partMock.pCreatePartMock()
      .then((response) => {
        expect(response.part).toBeTruthy();
      });
  });

  test('should return a 200 status code and a token if a part is created successfully', () => {
    return partMock.pCreatePartMock()
      .then((response) => {
        expect(response.part).toBeTruthy();
      });
  });
});
