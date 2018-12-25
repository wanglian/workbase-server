import './channel-modal.html';

import SimpleSchema from 'simpl-schema';

const CHANNEL_FORM_SCHEMA = new SimpleSchema({
  name: {
    type: String,
    max: 50,
    autoform: {
      type: 'text',
      label: I18n.t("Channel Name")
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
  }
});

Template.ChannelListModal.onRendered(function() {
  this.subscribe("channel");
});

Template.ChannelListModal.helpers({
  channels() {
    return Users.find({"profile.type": 'Channels'}, {sort: {"profile.name": 1}});
  }
});

Template.ChannelListModal.events({
  "click #btn-add-channel"(e, t) {
    e.preventDefault();
    Modal.show('AddChannelModal', null, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click .btn-edit-channel"(e, t) {
    e.preventDefault();
    Modal.show('EditChannelModal', this, {
      backdrop: 'static',
      keyboard: false
    });
  },
  "click .btn-channel-members"(e, t) {
    e.preventDefault();
    Modal.show('ChannelMembersModal', this, {
      backdrop: 'static',
      keyboard: false
    });
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

Template.ChannelMembersModal.onRendered(function() {
  this.subscribe("channel.members", this.data._id);
});

Template.ChannelMembersModal.helpers({
  members() {
    return ChannelUsers.find({channelId: this._id});
  },
  users() {
    let memberIds = ChannelUsers.find({channelId: this._id}).map(cu => cu.userId);
    return Users.find({_id: {$nin: memberIds}, "profile.type": 'Users'});
  }
});

Template.ChannelMembersModal.events({
  "click .btn-add-member"(e, t) {
    e.preventDefault();
    Meteor.call("addChannelMember", t.data._id, $(e.target).data("id"));
  },
  "click .btn-remove-member"(e, t) {
    e.preventDefault();
    Meteor.call("removeChannelMember", t.data._id, $(e.target).data("id"));
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