Threads.helpers({
  internal() {
    clientOnly();
    return this.params && this.params.internal;
  },
  chat() {
    clientOnly();
    return Users.findOne(this.params.chat);
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
  details: ['Chat', 'Search', 'Files'],
  title(thread) {
    clientOnly();
    // (chat => chat && chat.name())(thread.chat())
    if (thread.internal()) {
      return chatName(thread.chat());
    } else {
      return thread.subject || chatName(thread.chat());
    }
  },
  actions() {
    clientOnly();
    return [
      ThreadActions.star,
      ThreadActions.search
    ]
  }
});