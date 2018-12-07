ThreadCategories.add("Chat", {
  icon: "fa fa-comment-o",
  iconUnread: "fa fa-comment",
  title(thread) {
    let chat = Users.findOne(thread.params.chat);
    return chat && chat.name();
  }
});