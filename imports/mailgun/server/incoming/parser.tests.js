import { isOneToOne } from './parser.js';

_ = require('lodash');

let chai = require('chai');
let expect = chai.expect;

describe('isOneToOne', function() {
  
  it("check", function() {
    user1 = {_id: "1"}
    user2 = {_id: "2"}
    user3 = {_id: "3"}
    // toUser, toUsers, ccUsers
    expect(isOneToOne(user1, [], [])).to.eq(true);
    expect(isOneToOne(user1, [user1], [])).to.eq(true);
    expect(isOneToOne(user1, [user2], [])).to.eq(true);
    expect(isOneToOne(user1, [], [user2])).to.eq(false);
    expect(isOneToOne(user1, [user1, user2], [])).to.eq(false);
  });
});
