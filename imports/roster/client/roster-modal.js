import './roster-modal.html';

import SimpleSchema from 'simpl-schema';

const build_roster_schema = () => {
  return new SimpleSchema({
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
};

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
    return build_roster_schema();
  }
});

Template.EditRosterModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return build_roster_schema();
  }
});

Template.EditContactModal.helpers({
  formCollection() {
    return Contacts;
  },
  formSchema() {
    return new SimpleSchema({
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
          $(".modal button[class=close]").click();
        }
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
          $(".modal button[class=close]").click();
        }
        this.done();
      });
    }
  }
});