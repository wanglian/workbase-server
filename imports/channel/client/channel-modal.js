import './channel-modal.html';

import SimpleSchema from 'simpl-schema';

const CHANNEL_FORM_SCHEMA = new SimpleSchema({
  name: {
    type: String,
    autoform: {
      type: 'text',
      label: "Name"
    }
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'emailInput',
      label: "Email"
    }
  }
});

Template.AddChannelModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return CHANNEL_FORM_SCHEMA;
  }
});

Template.EditChannelModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return CHANNEL_FORM_SCHEMA;
  }
});

AutoForm.hooks({
  "add-channel-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('addChannel', insertDoc.email, insertDoc.name, insertDoc.title, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('AddChannelModal');
        this.done();
      });
    }
  },
  "edit-channel-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('editChannel', currentDoc._id, insertDoc.email, insertDoc.name, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('EditChannelModal');
        this.done();
      });
    }
  }
});