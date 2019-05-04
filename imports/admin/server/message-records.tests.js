import '/imports/test/test-helpers';
import './message-records';

describe('MessageStatRecords.queryByDays', function() {
  it("should return an array with size of days", async function() {
    let re = await MessageStatRecords.queryByDays(30);
    expect(_.size(re)).to.eq(3);
    expect(re.internal.length).to.eq(30);
    expect(re.outgoing.length).to.eq(30);
    expect(re.incoming.length).to.eq(30);
  });
});

describe('MessageStatRecords.queryByHours', function() {
  it("should return an array with size of 24", async function() {
    let re = await MessageStatRecords.queryByHours(30);
    expect(_.size(re)).to.eq(3);
    expect(re.internal.length).to.eq(24);
    expect(re.outgoing.length).to.eq(24);
    expect(re.incoming.length).to.eq(24);
  });
});
