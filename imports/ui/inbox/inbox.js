import './inbox.html';

Template.Inbox.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    $('.threads .thread').removeClass('active');
    if (data.thread) {
      $(`.thread#${data.thread._id}`).addClass('active');
    }
  });
});

Template.ThreadListItem.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});
