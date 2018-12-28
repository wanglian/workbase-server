import './search.html';

Template.SearchModal.onRendered(function() {
  this.$('.modal').on('shown.bs.modal', function (e) {
    $('.modal input[type=text]').focus();
  });
});

Template.SearchModal.helpers({
  threadsIndex: () => ThreadsIndex,
  inputAttributes() {
    return {class: 'form-control', placeholder: I18n.t("Search Subjects")};
  },
  thread() {
    // to reuse thread template
    let doc = this;
    doc._id = doc.__originalId;
    return doc;
  }
});

Template.SearchModal.events({
  "click a.thread"(e, t) {
    Modal.hide('SearchModal');
  }
});

Template.ThreadSearchModal.onRendered(function() {
  this.$('.modal').on('shown.bs.modal', function (e) {
    $('.modal input[type=text]').focus();
  });
});

Template.ThreadSearchModal.helpers({
  messagesIndex: () => MessagesIndex,
  inputAttributes() {
    return {class: 'form-control', placeholder: I18n.t("Search Messages")};
  }
});

Template.ThreadSearchModal.events({
  "focus input[type=text]"(e, t) {
    MessagesIndex.getComponentMethods().addProps('threadId', t.data._id);
  }
});
