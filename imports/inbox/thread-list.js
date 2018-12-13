import './thread-list.html';
import './thread-list.css';

const PER_PAGE = 20;
Template.ThreadList.onCreated(function() {
  this.limit = new ReactiveVar(PER_PAGE);
  this.autorun(() => {
    this.subs = this.subscribe("threads", {limit: this.limit.get()});
  });
});

Template.ThreadList.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.thread) {
      $(`.thread#${data.thread._id}`).addClass('active');
    }
  });
});

Template.ThreadList.helpers({
  threads() {
    return Threads.find({}, {sort: {updatedAt: -1}});
  },
  ready() {
    return Template.instance().subs.ready();
  },
  hasMore() {
    let total = Counts.get('threads');
    let limit = Template.instance().limit.get();
    return total > limit;
  }
});

Template.ThreadList.events({
  "click .btn-load-more"(e, t) {
    e.preventDefault();
    t.limit.set(t.limit.get() + PER_PAGE);
  }
});

Template.ThreadListItem.helpers({
  threadPath() {
    let currentRoute = Router.current();
    return currentRoute.route.path(_.defaults({_id: this._id}, currentRoute.params));
  },
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});
