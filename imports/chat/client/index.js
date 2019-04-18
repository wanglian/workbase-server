import './chat';
import './style.css';

Threads.helpers({
  internal() {
    return this.params && this.params.internal;
  },
  chat() {
    return this.params && Users.findOne(this.params.chat);
  }
});

const chatName = (chat) => chat && chat.name();
ThreadCategories.add("Chat", {
  icon(thread) {
    return thread.internal() ? "fa fa-comment-o" : "fa fa-envelope-open-o";
  },
  iconUnread(thread) {
    return thread.internal() ? "fa fa-comment" : "fa fa-envelope-o";
  },
  details: ['Chat', 'Search', 'PinMessages', 'Files'],
  title(thread) {
    // (chat => chat && chat.name())(thread.chat())
    if (thread.internal()) {
      return chatName(thread.chat());
    } else {
      return thread.subject || chatName(thread.chat());
    }
  },
  actions(thread) {
    return thread.internal() ? [
      ThreadActions.notes,
      ThreadActions.star,
      ThreadActions.archive
    ] : [
      ThreadActions.notes,
      ThreadActions.star,
      ThreadActions.spam,
      ThreadActions.archive
    ];
  }
});
