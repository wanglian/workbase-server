import './application-layout.html';
import './send-email-modal';
import './style.css';

Template.ApplicationLayout.onRendered(function() {
  $('#btn-send-email [data-toggle="tooltip"]').tooltip({delay: 1000}); // not working?
  Tracker.autorun(() => {
    let title = Instance.company();
    let count = Counts.get('count-unread-inbox');
    document.title = (count > 0) ? `(${count}) ${title}` : title;
  });
});

Template.ApplicationLayout.events({
  "click #btn-send-email"(e, t) {
    e.preventDefault();
    Modal.show("SendEmailModal", null, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "focus #search-form input[name=search]"(e, t) {
    e.preventDefault();
    Modal.show("SearchModal", null, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click #btn-sign-out"(e, t) {
    e.preventDefault();
    // history.go(-1);
    Meteor.logout();
  }
});
