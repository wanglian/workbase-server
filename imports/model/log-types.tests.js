import '/imports/test/test-helpers';
import './log-types';

describe('LogTypes', function() {
  it("can add and get a log type", function() {
    LogTypes.add("test", { i18nKey: "log_test" });
    let def = LogTypes.get('test');
    expect(_.size(def)).to.eq(1);
    should.exist(def['i18nKey']);
  });
});
