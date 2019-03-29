import './inbox.html';

Template.InboxMenu.events({
  "click #btn-send-email"(e, t) {
    e.preventDefault();
    Modal.show("SendEmailModal", null, {
      backdrop: 'static'
    });
  }
});
