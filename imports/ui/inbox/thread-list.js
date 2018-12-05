import './thread-list.html';
import './thread-list.css';

Template.ThreadListItem.helpers({
  icon() {
    let c = ThreadCategories.get(this.category)
    return this.read ? c.icon : c.iconUnread;
  }
});
