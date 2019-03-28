Threads.helpers({
  internal() {
    clientOnly();
    return this.params && this.params.internal;
  },
  chat() {
    clientOnly();
    return this.params && Users.findOne(this.params.chat);
  }
});

const chatName = (chat) => chat && chat.name();
ThreadCategories.add("Chat", {
  icon(thread) {
    clientOnly();
    return thread.internal() ? "fa fa-comment-o" : "fa fa-envelope-open-o";
  },
  iconUnread(thread) {
    clientOnly();
    return thread.internal() ? "fa fa-comment" : "fa fa-envelope-o";
  },
  details: ['Chat', 'Search', 'PinMessages', 'Files'],
  title(thread) {
    clientOnly();
    // (chat => chat && chat.name())(thread.chat())
    if (thread.internal()) {
      return chatName(thread.chat());
    } else {
      return thread.subject || chatName(thread.chat());
    }
  },
  actions(thread) {
    clientOnly();
    return [
      ThreadActions.notes,
      ThreadActions.star,
      ThreadActions.archive
    ]
  }
});