import './settings.html';

import Swal from 'sweetalert2';

Template.SettingCompanyModal.helpers({
  instance() {
    return Instance.get();
  }
});

Template.SettingCompanyModal.events({
  "click #btn-modify-company"(e, t) {
    e.preventDefault();

    Swal({
      title: I18n.t("settings_company_update_name"),
      input: 'text',
      inputValue: this.company,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_save"),
      cancelButtonText: I18n.t("app_action_discard"),
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("updateCompanyName", result.value);
      }
    });
  },
  "click #btn-modify-domain"(e, t) {
    e.preventDefault();

    Swal({
      title: I18n.t("settings_company_update_domain"),
      input: 'text',
      inputValue: this.domain,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_save"),
      cancelButtonText: I18n.t("app_action_discard"),
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("updateCompanyDomain", result.value);
      }
    });
  }
});

Template.SettingEmailModal.helpers({
  instance() {
    return Instance.get();
  },
  mailgunEndpoint() {
    return Meteor.absoluteUrl() + 'api/v1/mailgun';
  }
});

Template.SettingEmailModal.events({
  "click #btn-validate"(e, t) {
    e.preventDefault();
    Meteor.call("validateMailgun", (err, res) => {
      //
    });
  },
  "click #btn-modify-key"(e, t) {
    e.preventDefault();

    Swal({
      title: I18n.t("settings_email_update_key"),
      input: 'text',
      inputValue: this.mailgun && this.mailgun.key,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_save"),
      cancelButtonText: I18n.t("app_action_discard"),
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("updateMailgunKey", result.value);
      }
    });
  }
});

Template.SettingStorageModal.helpers({
  instance() {
    return Instance.get();
  }
});
