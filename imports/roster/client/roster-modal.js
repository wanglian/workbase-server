import './roster-modal.html';

import SimpleSchema from 'simpl-schema';

const ROSTER_FORM_SCHEMA = new SimpleSchema({
  name: {
    type: String,
    max: 50,
    autoform: {
      type: 'text',
      label: I18n.t("User Name")
    }
  },
  email: {
    type: String,
    max: 50,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'emailInput',
      label: "Email"
    }
  },
  password: {
    type: String,
    max: 50,
    optional: true,
    autoform: {
      type: 'password',
      label: I18n.t("Password")
    }
  },
  title: {
    type: String,
    max: 50,
    optional: true,
    autoform: {
      type: 'text',
      label: I18n.t('Work Title'),
    }
  }
});

const CONTACT_FORM_SCHEMA= new SimpleSchema({
  name: {
    type: String,
    max: 50,
    autoform: {
      type: 'text',
      label: I18n.t("User Name")
    }
  },
  email: {
    type: String,
    max: 50,
    regEx: SimpleSchema.RegEx.Email,
    autoform: {
      type: 'text',
      label: "Email"
    }
  },
  title: {
    type: String,
    max: 50,
    optional: true,
    autoform: {
      type: 'text',
      label: I18n.t('Work Title'),
    }
  },
  company: {
    type: String,
    max: 50,
    optional: true,
    autoform: {
      type: 'text',
      label: I18n.t("Company")
    }
  },
  noreply: {
    type: Boolean,
    label: I18n.t('Noreply'),
    optional: true,
    autoform: {
      type: "boolean-checkbox"
    }
  }
});

Template.RosterListModal.onRendered(function() {
  // this.subscribe("roster");
});

Template.RosterListModal.helpers({
  users() {
    return Users.find({"profile.type": 'Users'}, {sort: {"profile.name": 1}});
  }
});

Template.RosterListModal.events({
  "click #btn-add-roster"(e, t) {
    e.preventDefault();
    Modal.show('AddRosterModal', null, {
      backdrop: 'static'
    });
  },
  "click .btn-edit-roster"(e, t) {
    e.preventDefault();
    Modal.show('EditRosterModal', this, {
      backdrop: 'static'
    });
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

Template.EditContactModal.helpers({
  formCollection() {
    return Contacts;
  },
  formSchema() {
    return CONTACT_FORM_SCHEMA;
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
          // Router.go('roster', {_id: res});
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
  },
  "edit-contact-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('editContact', currentDoc._id, insertDoc, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('EditContactModal');
        this.done();
      });
    }
  }
});