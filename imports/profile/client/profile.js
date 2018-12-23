import './profile.html';

import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';
import autosize from 'autosize';

const FORM_SCHEMA = new SimpleSchema({
  language: {
    type: String,
    max: 50,
    optional: true,
    autoform: {
      type: 'select',
      label: I18n.t("Language"),
      options: [
        {label: "English", value: "en-US"},
        {label: "简体中文", value: "zh-CN"}
      ]
    }
  },
  skin: {
    type: String,
    max: 20,
    optional: true,
    autoform: {
      type: 'select',
      label: I18n.t("Skin"),
      options: [
        {label: I18n.t("Blue Skin"), value: "blue"},
        {label: I18n.t("Purple Skin"), value: "purple"},
        {label: I18n.t("Blue Light"), value: "blue-light"},
        {label: I18n.t("Purple Light"), value: "purple-light"}
      ]
    }
  },
  signature: {
    type: String,
    max: 200,
    optional: true,
    autoform: {
      type: 'textarea',
      label: I18n.t("Signature")
    }
  }
});

Template.Profile.onRendered(function() {
  autosize($('form textarea'));
});

Template.Profile.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return FORM_SCHEMA;
  },
  defaultSignature() {
    let user = Meteor.user();
    return user.name() + '\r\n' + user.email();
  }
});

Template.Profile.events({
  "change form select[name=skin]"(e, t) {
    e.preventDefault();
    Meteor.call('updateProfile', {skin: $(e.target).val()}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        document.location.reload(true);
      }
    });
  }
});

AutoForm.hooks({
  "profile-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('updateProfile', insertDoc, (err, res) => {
        if (err) {
          Swal({
            title: err,
            type: "error"
          });
        } else {
          Swal({
            title: I18n.t("Profile Saved"),
            type: "info"
          });
        }
        this.done();
      });
    }
  }
});
