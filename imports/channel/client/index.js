import '../channel-users';
import './channels';
import './channel-modal';

ThreadCategories.add("Channel", {
  icon: "fa fa-slack",
  iconUnread: "fa fa-slack",
  title(thread) {
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('channel_list'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('ChannelListModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('channel_action_new'),
        icon: "fa fa-plus",
        action() {
          Modal.show('AddChannelModal', null, {
            backdrop: 'static'
          });
        }
      }
    ];
  }
});

const ChannelSubs = new SubsManager({
  cacheLimit: 10,
  expireIn: 60
});
Accounts.onLogout(function() {
  ChannelSubs.clear();
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
      ready:      this.sub.ready(),
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
