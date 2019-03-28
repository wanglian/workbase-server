import './view.html';

import SimpleSchema from 'simpl-schema';
import autosize from 'autosize';

Template.ThreadNotesModal.onRendered(function() {
  //
});

Template.ThreadNotesModal.helpers({
  formCollection() {
    return Threads;
  },
  formSchema() {
    return new SimpleSchema({
      content: {
        type: String,
        max: 10000,
        autoform: {
          type: 'textarea',
          label: false
        }
      }
    });
  }
});
