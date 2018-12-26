ThreadCategories.add("Chat", {
  icon: "fa fa-comment-o",
  iconUnread: "fa fa-comment",
  details: false,
  title(thread, detail=false) { // client only
    let chat = Users.findOne(thread.params.chat);
    // if (detail) {
    //   return chat && I18n.t("Chat with", {name: chat.name()});
    // } else {
    //   return chat && chat.name();
    // }
    return chat && chat.name();
  }
});