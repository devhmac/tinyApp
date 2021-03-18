const { assert } = require('chai');
const { generateRandomString, getUserByEmail, urlsForUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


describe('getUserByEmail', () => {
  it('should return the user object with that valid email', () => {
    const user = getUserByEmail('user@example.com', testUsers);
    const expectedOutput = testUsers['userRandomID'];

    assert.deepEqual(user, expectedOutput);
  });
  it('should return false if it cannot find a matching email in the database', () => {
    const user = getUserByEmail('cat@cat.com', testUsers);
    assert.isFalse(user);
  });

});