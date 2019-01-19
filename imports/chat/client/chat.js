import './chat.html';

Template.ThreadDetailChat.events({
  "click #btn-create-group"(e, t) {
    e.preventDefault();

    Modal.show('ChooseUsersModal');
  }
});
