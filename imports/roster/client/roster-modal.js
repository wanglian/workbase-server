import './roster-modal.html';

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
          label: I18n.t("users_name")
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
          label: I18n.t('profile_title'),
        }
      },
      company: {
        type: String,
        max: 50,
        optional: true,
        autoform: {
          type: 'text',
          label: I18n.t("users_company")
        }
      },
      noreply: {
        type: Boolean,
        label: I18n.t('users_noreply'),
        optional: true,
        autoform: {
          type: "boolean-checkbox"
        }
      }
    });
  }
});

AutoForm.hooks({
  "edit-contact-form": {
    onSubmit(insertDoc, updateDoc, currentDoc) {
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