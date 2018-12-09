import './send-email-modal.html';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.SendEmailModal.onRendered(function() {
  $('input[name=to]').selectize(emailSelectizeConfig);
});

Template.SendEmailModal.helpers({
  formCollection() {
    return Threads;
  },
  formSchema() {
    return new SimpleSchema({
      to: {
        type: String,
        autoform: {
          type: 'text',
          label: "To",
          placeholder: "Recipients"
        }
      },
      subject: {
        type: String,
        autoform: {
          type: 'text',
          label: false,
          placeholder: "Subject"
        }
      },
      content: {
        type: String,
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
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('sendEmail', insertDoc.to, insertDoc.subject, insertDoc.content, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('SendEmailModal');
        this.done();
      });
    }
  }
});

const REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
                    '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
const emailSelectizeConfig = {
  persist: false,
  maxItems: null,
  valueField: 'email',
  labelField: 'name',
  searchField: ['name', 'email'],
  render: {
    item: function(item, escape) {
      return '<div>' +
        (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '') +
        (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
      '</div>';
    },
    option: function(item, escape) {
      var label = item.name || item.email;
      var caption = item.name ? item.email : null;
      return '<div>' +
        '<span class="label">' + escape(label) + '</span>' +
        (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
      '</div>';
    }
  },
  createFilter: function(input) {
    var match, regex;

    // email@address.com
    regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
    match = input.match(regex);
    if (match) return !this.options.hasOwnProperty(match[0]);

    // name <email@address.com>
    regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
    match = input.match(regex);
    if (match) return !this.options.hasOwnProperty(match[2]);

    return false;
  },
  create: function(input) {
    if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
      return {email: input};
    }
    var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
    if (match) {
      return {
        email : match[2],
        name  : $.trim(match[1])
      };
    }
    alert('Invalid email address.');
    return false;
  }
};