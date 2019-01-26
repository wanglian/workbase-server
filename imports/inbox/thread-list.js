import './thread-list.html';
import './thread-list.css';

Template.ThreadList.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.thread) {
      $(`.thread#${data.thread._id}`).addClass('active');
    }
  });
});

Template.ThreadListItemTemplate.helpers({
  threadPath() {
    let currentRoute = Router.current();
    if (['inbox', 'channel', 'admin', 'star'].includes(currentRoute.route.getName())) {
      let params = _.defaults({_id: this._id}, currentRoute.params);
      let query = currentRoute.params.query;
      query = _.omit(query, 'detail');
      return currentRoute.route.path(params, {query});
    } else {
      return Router.routes['inbox'].path({_id: this._id});
    }
  }
});

Template.ThreadListItem.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});

Template.SimpleThreadListItem.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return c.icon;
  }
});
