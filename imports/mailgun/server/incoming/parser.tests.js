import '/imports/test/test-helpers';
import './parser';

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
    expect(isOneToOne(user1, [user1], [user2])).to.eq(false);
    expect(isOneToOne(user1, [user1, user2], [])).to.eq(false);
  });
});
