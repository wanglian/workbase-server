// - threadId
// - userType: Users, Contacts
// - userId
// - internal: boolean
// - content
// - contentType: text/html/image/log
// - fileIds: [fileId]
// - inlineFileIds: [fileId]
// - summary
// - emailId
// - email: from, to, cc, time
import { Index, MinimongoEngine } from 'meteor/easy:search';

Messages = new Mongo.Collection('messages');

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

Messages.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  },
  thread() {
    return Threads.findOne(this.threadId);
  },
  image() {
    return this.contentType === 'image' && this.inlineFileIds && Files.findOne(this.inlineFileIds[0]);
  },
  files() {
    return this.fileIds && Files.find({_id: {$in: this.fileIds}});
  }
});
