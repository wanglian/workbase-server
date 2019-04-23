import { resetDatabase } from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import '/imports/test/test-helpers';
import './publications';

describe('instance', function() {
  beforeEach(() => {
    resetDatabase();
  });

  it('should publish 1 instance', function(done) {
    let user = Factory.create('user');
    let instance = Factory.create('instance');
    const collector = new PublicationCollector({ userId: user._id });

    collector.collect('instance', (collections) => {
      expect(collections.instance.length).to.eq(1);
      done();
    });
  });

  it('should publish 1 thread', function(done) {
    let user = Factory.create('user');
    let thread = Factory.create('thread', {userId: user._id, category: 'Account'});
    const collector = new PublicationCollector({ userId: user._id });

    collector.collect('instance', (collections) => {
      expect(collections.threads.length).to.eq(1);
      done();
    });
  });
});