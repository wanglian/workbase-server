import './settings.html';

import SimpleSchema from 'simpl-schema';
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
  "click #btn-setup-mailgun"(e, t) {
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

Template.SettingStorageModal.events({
  "click #btn-validate"(e, t) {
    e.preventDefault();
    Meteor.call("validateMailgun", (err, res) => {
      //
    });
  },
  "click #btn-setup-s3"(e, t) {
    e.preventDefault();

    Modal.show("SettingStorageS3Modal", this, {
      backdrop: 'static'
    });
  },
  "click #btn-setup-gridfs"(e, t) {
    e.preventDefault();

    Swal({
      title: I18n.t("settings_confirm_setup_gridfs"),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t("app_action_confirm"),
      cancelButtonText: I18n.t("app_action_discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call('updateStorage', 'GridFs', (err, res) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }
});

Template.SettingStorageS3Modal.helpers({
  formCollection() {
    return Instance;
  },
  formSchema() {
    return new SimpleSchema({
      s3Key: {
        type: String,
        max: 20,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Key'),
        }
      },
      s3Secret: {
        type: String,
        max: 40,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Secret'),
        }
      },
      s3Bucket: {
        type: String,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Bucket'),
        }
      },
      s3Region: {
        type: String,
        max: 30,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Region'),
        }
      }
    });
  }
});

AutoForm.hooks({
  "setup-s3-form": {
    onSubmit(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('updateStorage', 'S3', {
          key:    insertDoc.s3Key,
          secret: insertDoc.s3Secret,
          bucket: insertDoc.s3Bucket,
          region: insertDoc.s3Region,
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          $('#SettingStorageS3Modal button[class=close]').click();
        }
        this.done();
      });
    }
  }
});
