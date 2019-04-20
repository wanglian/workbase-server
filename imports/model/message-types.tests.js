import '/imports/test/test-helpers';
import './message-types';

describe('MessageTypes', function() {
  it("can set and get a message type", function() {
    MessageTypes.add("test", { property: "test p" });
    let def = MessageTypes.get('test');
    expect(_.size(def)).to.eq(1);
    should.exist(def['property']);
  });

  it("shoud have predefined types: log/image", function() {
    should.exist(MessageTypes.get('log').summaryLocalized);
    should.exist(MessageTypes.get('image').summaryLocalized);
  });
});
