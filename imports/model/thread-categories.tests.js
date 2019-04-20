import '/imports/test/test-helpers';
import './thread-categories';

describe('ThreadCategories', function() {
  it("can set and get a category", function() {
    ThreadCategories.add("test", { property: "test p" });
    let def = ThreadCategories.get('test');
    expect(_.size(def)).to.eq(1);
    should.exist(def['property']);
  });
});
