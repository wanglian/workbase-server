import '../channel-users';
import './channels';
import './channel-modal';

const ChannelSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});

ChannelController = BoxController.extend({
  template: 'Channels',
  channelId() {
    return this.params.channel;
  },
  subscriptions() {
    this.sub = ChannelSubs.subscribe("channel.threads", this.channelId(), {limit: this.limit()});
    let threadId = this.threadId();
    if (threadId) {
      ChannelSubs.subscribe("thread", threadId);
      ChannelSubs.subscribe("thread.files.pending", threadId);
    }
  },
  nextPath() {
    let count = Counts.get(`channel.threads.${this.channelId()}`);
    if (count > this.limit()) {
      let query = _.clone(this.params.query);
      _.extend(query, {limit: this.limit() + this.perPage});
      return this.route.path(this.params, {query});
    }
  },
  data() {
    let channelId = this.channelId();
    return {
      channel:    Users.findOne(channelId),
      threads:    Threads.find({channelId}, {sort: {updatedAt: -1}}),
      thread:     this.thread(),
      ready:      this.threadsSub.ready(),
      nextPath:   this.nextPath(),
      hasRight:   !!this.threadId(),
      hasSidebar: !!this.params.query.detail
    };
  }
});

Router.route('/channels/:channel/:_id?', {
  name: 'channel',
  controller: 'ChannelController'
});
