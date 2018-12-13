import '../channel-users';
import './channels';
import './channel-modal';

ChannelController = ApplicationController.extend({
  template: 'Channels',
  perPage: 20,
  channel() {
    return this.params.channel;
  },
  subscriptions() {
    this.threadsSub = this.subscribe("channel.threads", this.channel(), {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      this.subscribe("thread", threadId);
      this.subscribe("messages", threadId);
    }
  },
  limit: function() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  threadId() {
    return this.params._id;
  },
  detail() {
    return this.params.query.detail;
  },
  thread() {
    let threadId = this.threadId();
    return threadId && Threads.findOne(threadId);
  },
  data() {
    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Counts.get(`channel.threads.${this.channel()}`) > this.limit();
    return {
      channel:    Users.findOne(this.channel()),
      threads:    Threads.find({}, {sort: {updatedAt: -1}}),
      thread:     this.thread(),
      ready:      this.threadsSub.ready(),
      nextPath:   hasMore ? nextPath : null,
      hasRight:   !!this.threadId(),
      hasSidebar: !!this.params.query.detail
    };
  }
});

Router.route('/channels/:channel/:_id?', {
  name: 'channel',
  controller: 'ChannelController'
});
