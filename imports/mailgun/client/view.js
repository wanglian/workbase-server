import './view.html';

Template.MailgunEmails.events({
  "click .btn-parse"(e, t) {
    e.preventDefault();
    Meteor.call("parseMailgunEmail", this._id);
  }
});
