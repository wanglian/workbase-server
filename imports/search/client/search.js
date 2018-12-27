import './search.html';

Template.SearchModal.onRendered(function() {
  $('.modal input[type=text]').focus();
});

Template.SearchModal.helpers({
  threadsIndex: () => ThreadsIndex,
  inputAttributes() {
    return {class: 'form-control', placeholder: I18n.t("Search")};
  }
});

Template.SearchModal.events({
  "click a.thread"(e, t) {
    Modal.hide('SearchModal');
  }
});

Template.ThreadSearchModal.onRendered(function() {
  $('.modal input[type=text]').focus();
});

Template.ThreadSearchModal.helpers({
  messagesIndex: () => MessagesIndex,
  inputAttributes() {
    return {class: 'form-control', placeholder: I18n.t("Search")};
  }
});

Template.ThreadSearchModal.events({
  "focus input[type=text]"(e, t) {
    MessagesIndex.getComponentMethods().addProps('threadId', t.data._id);
  }
});
