import {Instance} from '/imports/model/instance';
import {Threads} from '/imports/model/threads';
import {Files} from '/imports/files/client/files';
import {selectizeEmail} from '/imports/autoform';
import {I18n} from '/imports/i18n/i18next';
import './view.html';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';
import Swal from 'sweetalert2';

SimpleSchema.extendOptions(['autoform']);

Template.LinkToSendEmail.helpers({
  emailEnabled() {
    return Instance.emailEnabled();
  }
});

Template.LinkToSendEmail.events({
  "click #btn-send-email"(e, t) {
    e.preventDefault();
    Modal.show("SendEmailModal", null, {
      backdrop: 'static'
    });
  }
});

Template.SendEmailModal.onCreated(function() {
  this.subscribe("files.pending");
});

Template.SendEmailModal.onRendered(function() {
  $('input[name=to]').selectize(selectizeEmail('queryContacts'));
});

Template.SendEmailModal.helpers({
  pendingFiles() {
    return Files.find({"meta.relations": {$elemMatch: {threadId: null, type: 'file', messageId: null}}}, {sort: {"meta.relations.createdAt": -1}});
  },
  formCollection() {
    return Threads;
  },
  formSchema() {
    return new SimpleSchema({
      to: {
        type: String,
        max: 1000,
        autoform: {
          type: 'text',
          label: I18n.t("email_to"),
          placeholder: I18n.t("email_recipients")
        }
      },
      subject: {
        type: String,
        max: 200,
        autoform: {
          type: 'text',
          label: false,
          placeholder: I18n.t("email_subject")
        }
      },
      content: {
        type: String,
        max: 10000,
        autoform: {
          type: 'textarea',
          label: false,
          afFieldInput: {
            type: "textarea",
            rows: 8
          }
        }
      }
    });
  }
});

AutoForm.hooks({
  "send-email-form": {
    onSubmit(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      let fileIds = Files.find({"meta.relations": {$elemMatch: {threadId: null, messageId: null, type: 'file'}}}).map((f) => f._id);
      Meteor.call('sendEmail', insertDoc.to, insertDoc.subject, insertDoc.content, fileIds, (err, res) => {
        if (err) {
          console.log(err);
          this.done(new Error('Sending Email failed.'));
        } else {
          console.log(res);
          Router.go('inbox', {_id: res});
          $('#SendEmailModal button[class=close]').click();
          this.done();
        }
      });
    },
    onError(formType, error) {
      Swal({
        title: error.message,
        type: "error"
      });
    }
  }
});

