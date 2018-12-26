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
        {label: I18n.t("Red Skin"), value: "red"},
        {label: I18n.t("Green Skin"), value: "green"},
        {label: I18n.t("Yellow Skin"), value: "yellow"}
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

Template.ProfileModal.onRendered(function() {
  autosize($('form textarea'));
});

Template.ProfileModal.helpers({
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

Template.ProfileModal.events({
  "change form select[name=language]"(e, t) {
    e.preventDefault();
    Meteor.call('updateProfile', {language: $(e.target).val()}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        document.location.reload(true);
      }
    });
  },
  "change form select[name=skin]"(e, t) {
    e.preventDefault();
    Meteor.call('updateProfile', {skin: $(e.target).val()}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        document.location.reload(true);
      }
    });
  },
  "click #btn-cancel"(e, t) {
    e.preventDefault();
    history.go(-1);
  },
  "click #btn-upload-avatar"(e, t) {
    e.preventDefault();
    $('#avatar-file').click();
  },
  "change #avatar-file"(e, t) {
    Modal.show('AvatarUploadModal', {
      file: e.target.files[0]
    }, {
      backdrop: 'static',
      keyboard: false
    });
    $(e.target).val(""); // reset file input
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
        Modal.hide('ProfileModal');
        this.done();
      });
    }
  }
});

Template.AvatarUploadModal.onCreated(function() {
  this.currentUpload = new ReactiveVar(false);
});

import loadImage from "blueimp-load-image";
Template.AvatarUploadModal.onRendered(function() {
  loadImage(this.data.file, (img) => {
    $("#image-preview").html(img);
    $("#image-preview img").addClass("img-responsive center-block");
  }, {
    maxWidth:  "570",
    maxHeight: "350"
  });
});

Template.AvatarUploadModal.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.AvatarUploadModal.events({
  "click #btn-send-image"(e, t) {
    e.preventDefault();

    $('#btn-send-image').attr("disabled", "disabled");
    const upload = AvatarFiles.insert({
      file: t.data.file,
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);

    upload.on('start', function() {
      t.currentUpload.set(this);
    });

    upload.on('end', function(error, fileObj) {
      if (error) {
        alert('Error during upload: ' + error);
        $('#btn-send-image').attr("disabled", false);
      } else {
        // alert('File "' + fileObj.name + '" successfully uploaded');
        Meteor.call('updateProfile', {
          avatar: AvatarFiles.link(fileObj, 'thumbnail')
        }, (err, res) => {
          Modal.hide('AvatarUploadModal');
        });
      }
      t.currentUpload.set(false);
    });

    upload.start();
  }
});
