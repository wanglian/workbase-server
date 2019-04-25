import '../';
import './group';
import './style.css';

ThreadCategories.add("Group", {
  icon: "fa fa-comments-o",
  iconUnread: "fa fa-comments",
  details: ['Group', 'Search', 'Members', 'PinMessages', 'Files'],
  title(thread) {
    clientOnly();

    let members = thread.subject;
    if (_.isArray(members)) {
      let me = Meteor.user();
      _.pull(members, me.name());
      return members.join(', ');
    }
    return thread.subject;
  },
  actions() {
    return [
      ThreadActions.notes,
      ThreadActions.star,
      ThreadActions.archive
    ];
  }
});
