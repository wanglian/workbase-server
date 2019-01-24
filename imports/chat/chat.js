Threads.helpers({
  chat() {
    clientOnly();
    return Users.findOne(this.params.chat);
  }
});

ThreadCategories.add("Chat", {
  icon: "fa fa-comment-o",
  iconUnread: "fa fa-comment",
  details: ['Chat', 'Search', 'Files'],
  title(thread) {
    clientOnly();

    let chat = thread.chat();
    // if (detail) {
    //   return chat && I18n.t("Chat with", {name: chat.name()});
    // } else {
    //   return chat && chat.name();
    // }
    return chat && chat.name();
  }
});