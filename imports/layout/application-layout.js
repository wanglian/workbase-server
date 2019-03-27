import './application-layout.html';
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
  "focus #search-form input[name=search]"(e, t) {
    e.preventDefault();
    $(e.target).blur();
    Modal.show("SearchModal", null, {
      backdrop: 'static'
    });
  }
});
