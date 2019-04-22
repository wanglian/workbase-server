import './chat.html';

Template.ThreadDetailChat.helpers({
  detailTitle() {
    return this.internal() ? I18n.t("thread_chat") : I18n.t("Email");
  },
  includeUsers() {
    return [Meteor.user(), this.chat()];
  }
});
