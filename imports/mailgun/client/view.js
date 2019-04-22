import './view.html';

import Swal from 'sweetalert2';

Template.MailgunMenuItem.helpers({
  count() {
    return Counts.get("count-mailgun-error");
  }
});

Template.MailgunEmails.events({
  "click .btn-preview"(e, t) {
    e.preventDefault();
    Modal.show('MessageModal', {
      content: this['body-html'] || this['body-plain']
    });
  },
  "click .btn-parse"(e, t) {
    e.preventDefault();
    Meteor.call("parseMailgunEmail", this._id);
  },
  "click .btn-remove"(e, t) {
    e.preventDefault();
    Swal({
      title: I18n.t("Confirm drop email"),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_confirm"),
      cancelButtonText: I18n.t("app_action_discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call("removeMailgunEmail", this._id, (err, res) => {
          if (err || !res) {
            console.log(err || res);
          }
        });
      }
    });
  }
});
