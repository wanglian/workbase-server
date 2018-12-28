import { Index, MinimongoEngine } from 'meteor/easy:search';

ThreadsIndex = new Index({
  collection: Threads,
  fields: ['subject'],
  defaultSearchOptions: {limit: 15},
  engine: new MinimongoEngine({
    sort: () => { updatedAt: -1 },
    selector(searchObject, options, aggregation) {
      // retrieve the default selector
      const selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

      // options.search.userId contains the userId of the logged in user
      // selector.userType = 'Users';
      // selector.userId = options.search.userId;
      let threadIds = ThreadUsers.find({userType: 'Users', userId: options.search.userId}).map(tu => tu.threadId);
      selector._id = {$in: threadIds};
      console.log(selector);
      return selector;
    },
    transform(doc) {
      return Threads.findOne(doc._id);
    }
  })
});

MessagesIndex = new Index({
  collection: Messages,
  fields: ['content'],
  defaultSearchOptions: {limit: 15},
  engine: new MinimongoEngine({
    sort: () => { createdAt: -1 },
    selector(searchObject, options, aggregation) {
      // retrieve the default selector
      const selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

      // options.search.userId contains the userId of the logged in user
      // selector.userType = 'Users';
      // selector.userId = options.search.userId;

      // filter for thread
      if (options.search.props.threadId) {
        selector.threadId = options.search.props.threadId;
      }

      return selector;
    },
    transform(doc) {
      return Messages.findOne(doc._id);
    }
  })
});
