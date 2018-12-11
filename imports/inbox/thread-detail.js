import './thread-detail.html';
import './thread-detail.css';

import SimpleSchema from 'simpl-schema';

Template.ThreadDetail.helpers({
  canAddMember() {
    let thread = this;
    let currentUser = Meteor.user();
    return thread.category === 'Email' && thread.isOwner(currentUser);
  }
});

Template.ThreadDetail.events({
  "click #btn-add-member"(e, t) {
    e.stopPropagation();
    Modal.show('AddThreadMemberModal', this);
  }
});

Template.ThreadMembers.helpers({
  canRemove() {
    let member = this;
    let thread = Template.parentData();
    let currentUser = Meteor.user();
    return thread.isOwner(currentUser) && !currentUser.isMe(member);
  }
});

Template.ThreadMembers.events({
  "mouseenter .members-info"(e, t) {
    e.preventDefault();
    $(e.target).find(".btn-remove-member").removeClass('hide');
  },
  "mouseleave .members-info"(e, t) {
    e.preventDefault();
    $(e.target).find(".btn-remove-member").addClass('hide');
  },
  "click .btn-remove-member"(e, t) {
    e.preventDefault();
    Meteor.call("removeThreadMember", t.data._id, $(e.target).data("type"), $(e.target).data("id"));
  }
});

Template.AddThreadMemberModal.onRendered(function() {
  $('input[name=emails]').selectize(selectizeEmail('queryContactsForThread', {id: this.data._id}));
});

Template.AddThreadMemberModal.helpers({
  formCollection() {
    return Users;
  },
  formSchema() {
    return new SimpleSchema({
      emails: {
        type: String,
        max: 1000,
        autoform: {
          type: 'text',
          label: false
        }
      }
    });
  }
});

AutoForm.hooks({
  "add-thread-member-form": {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('addThreadMembers', this.formAttributes.threadId, insertDoc.emails, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        Modal.hide('AddThreadMemberModal');
        this.done();
      });
    }
  }
});
