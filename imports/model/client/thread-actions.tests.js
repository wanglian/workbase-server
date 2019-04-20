import '/imports/test/test-helpers';
import './thread-actions';

describe('ThreadActions', function() {
  it("should have predefined actions: star/archive/spam/search/notes", function() {
    should.exist(ThreadActions.star);
    should.exist(ThreadActions.archive);
    should.exist(ThreadActions.spam);
    should.exist(ThreadActions.search);
    should.exist(ThreadActions.notes);
  });
});
