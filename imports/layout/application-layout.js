import './application-layout.html';
import './send-email-modal';
import './style.css';

Template.ApplicationLayout.onCreated(function() {
  this.dropdownEnhenced = false;
});

Template.ApplicationLayout.onRendered(function() {
  $('#btn-send-email [data-toggle="tooltip"]').tooltip({delay: 1000}); // not working?
  Tracker.autorun(() => {
    let title = Instance.company();
    let count = Counts.get('count-unread-inbox');
    document.title = (count > 0) ? `(${count}) ${title}` : title;
  });
});

const stopForDropdown = (e) => {
  e.preventDefault();
};

Template.ApplicationLayout.events({
  "click #btn-send-email"(e, t) {
    e.preventDefault();
    Modal.show("SendEmailModal", null, {
      backdrop: 'static'
    });
  },
  "focus #search-form input[name=search]"(e, t) {
    e.preventDefault();
    $(e.target).blur();
    Modal.show("SearchModal", null, {
      backdrop: 'static'
    });
  },
  "click .dropdown"(e, t) {
    if (!t.dropdownEnhenced) {
      $('.dropdown').on('show.bs.dropdown', function(e) {
        console.log("show");
        $('a').on("click", stopForDropdown);
      });
      $('.dropdown').on('hide.bs.dropdown', function(e) {
        console.log("hide");
        $('a').off("click", stopForDropdown);
      });

      t.dropdownEnhenced = true;
    }
  },
  "click #btn-sign-out"(e, t) {
    e.preventDefault();
    // history.go(-1);
    Meteor.logout();
  }
});
