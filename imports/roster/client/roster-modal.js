import './roster-modal.html';

import SimpleSchema from 'simpl-schema';

const ROSTER_FORM_SCHEMA = new SimpleSchema({
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
  },
  password: {
    type: String,
    optional: true,
    autoform: {
      type: 'password',
      label: 'Password'
    }
  },
  title: {
    type: String,
    optional: true,
    autoform: {
      type: 'text',
      label: 'Title',
    }
  }
});

Template.AddRosterModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return ROSTER_FORM_SCHEMA;
  }
});

Template.EditRosterModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return ROSTER_FORM_SCHEMA;
  }
});

AutoForm.hooks({
  "add-roster-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('addMember', insertDoc.email, insertDoc.name, insertDoc.title, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('AddRosterModal');
        this.done();
      });
    }
  },
  "edit-roster-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('editMember', currentDoc._id, insertDoc.email, insertDoc.name, insertDoc.password, insertDoc.title, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('EditRosterModal');
        this.done();
      });
    }
  }
});