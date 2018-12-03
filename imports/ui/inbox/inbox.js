import './inbox.html';

Template.Inbox.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});