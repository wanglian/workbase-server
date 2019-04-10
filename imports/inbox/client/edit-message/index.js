import './view.html';
import './style.css';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.EditMessageButton.helpers({
  canEdit() {
    return this.internal && this.contentType == 'text' && this.userId == Meteor.userId();
  }
});

Template.EditMessageButton.events({
  "click .btn-edit"(e, t) {
    e.stopPropagation();
    Modal.show('EditMessageModal', this, {
      backdrop: 'static'
    });
  }
});

Template.EditMessageModal.helpers({
  formCollection() {
    return Messages;
  },
  formSchema() {
    return new SimpleSchema({
      content: {
        type: String,
        max: 10000,
        autoform: {
          type: 'textarea',
          rows: 3,
          label: false,
        }
      }
    });
  }
});

AutoForm.hooks({
  "edit-message-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      updateMessage.call({
        messageId: currentDoc._id,
        content:   insertDoc.content
      }, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          // Modal.hide("EditMessageModal");
          $('#EditMessageModal button[class=close]').click();
        }
      });
      this.done();
    }
  }
});
