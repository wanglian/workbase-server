import "./roster.html";

import SimpleSchema from 'simpl-schema';

const buildRosterSchema = () => {
  return new SimpleSchema({
    name: {
      type: String,
      max: 50,
      autoform: {
        type: 'text',
        label: I18n.t("users_name")
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
        label: I18n.t("users_password")
      }
    },
    title: {
      type: String,
      max: 50,
      optional: true,
      autoform: {
        type: 'text',
        label: I18n.t('profile_title'),
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
    return buildRosterSchema();
  }
});

Template.EditRosterModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return buildRosterSchema();
  }
});

AutoForm.hooks({
  "add-roster-form": {
    onSubmit(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('addMember', insertDoc.email, insertDoc.name, insertDoc.password, insertDoc.title, (err, res) => {
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
    onSubmit(insertDoc, updateDoc, currentDoc) {
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
  }
});
