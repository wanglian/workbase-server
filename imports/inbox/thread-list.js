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

Template.ThreadListItem.helpers({
  threadPath() {
    let currentRoute = Router.current();
    let params = _.defaults({_id: this._id}, currentRoute.params);
    let query = currentRoute.params.query;
    return currentRoute.route.path(params, {query});
  },
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});
