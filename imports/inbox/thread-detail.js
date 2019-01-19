import './thread-detail.html';
import './thread-detail.css';

import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';

Template.ThreadDetail.helpers({
  threadDetailTemplate() {
    return `ThreadDetail${this}`;
  }
});

Template.ThreadDetailMembers.helpers({
  showAddMember() {
    let thread = this;
    // let currentUser = Meteor.user();
    // return thread.category === 'Email' && thread.hasOwner(currentUser);
    return thread.category === 'Email';
  }
});

Template.ThreadDetailMembers.events({
  "click #btn-add-member"(e, t) {
    e.stopPropagation();
    let threadId = this._id;
    Modal.show('AddThreadMemberModal', {
      excludeIds: t.data.threadUsers().map(tu => tu.userId),
      callback(selectedUsers) {
        console.log(selectedUsers.length);
        Meteor.call('addThreadMembers', threadId, selectedUsers.map(u => u._id), (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
          $('#AddThreadMemberModal button[class=close]').click();
        });
      }
    }, {
      backdrop: 'static'
    });
  }
});

Template.ThreadMembers.helpers({
  showRemove() {
    let threadUser = this;
    let thread = Template.parentData();
    let currentUser = Meteor.user();
    // return thread.hasOwner(currentUser) && !currentUser.isMe(member);
    return !(currentUser.isMe(threadUser.user()) || threadUser.isOwner());
  }
});

Template.ThreadMembers.events({
  "click .btn-remove-member"(e, t) {
    e.preventDefault();

    let userType = $(e.target).data("type");
    let userId = $(e.target).data("id");
    let user = Users.findOne(userId);

    Swal({
      title: I18n.t("confirm remove member", {name: user.name()}),
      type: 'warning',
      position: 'center-end',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t("Confirm"),
      cancelButtonText: I18n.t("Discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call("removeThreadMember", t.data._id, userType, userId);
      }
    });
  }
});

Template.AddThreadMemberModal.onCreated(function() {
  this.selectedUsers = new ReactiveVar([]);
  this.selectedList = new ReactiveVar(false);
  this.search = new ReactiveVar(false);
});

Template.AddThreadMemberModal.helpers({
  users() {
    let tmpl = Template.instance();
    if (tmpl.selectedList.get()) {
      return tmpl.selectedUsers.get();
    }
    let conditions = {"profile.type": {$in: ['Users', 'Contacts']}};
    if (!_.isEmpty(this.excludeIds)) {
      _.extend(conditions, {_id: {$nin: this.excludeIds}});
    }
    let keyword = tmpl.search.get();
    if (!_.isEmpty(keyword)) {
      _.extend(conditions, {$or: [
        {"profile.name": {$regex: keyword, $options: 'i'}},
        {"emails.address": {$regex: keyword, $options: 'i'}}
      ]});
    }
    return Users.find(conditions);
  },
  selectedList() {
    return Template.instance().selectedList.get();
  },
  selectedUsers() {
    return Template.instance().selectedUsers.get();
  },
  search() {
    return Template.instance().search.get();
  },
  selected() {
    let users = Template.instance().selectedUsers.get();
    return _.find(users, {_id: this._id});
  }
});

Template.AddThreadMemberModal.events({
  "click .btn-toggle-select"(e, t) {
    e.preventDefault();

    let users = t.selectedUsers.get();
    if (_.find(users, {_id: this._id})) {
      _.remove(users, u => u._id === this._id);
    } else {
      users.push(this);
    }
    t.selectedUsers.set(users);
  },
  "click .btn-toggle-list"(e, t) {
    e.preventDefault();

    let list = t.selectedList.get();
    if (list) {
      t.selectedList.set(false);
    } else {
      t.selectedList.set(true);
    }
  },
  "keyup #user-search"(e, t) {
    if (e.which === 13) {
      e.preventDefault();
      t.search.set($(e.target).val());
    }
  },
  "click #btn-cancel-search-users"(e, t) {
    e.preventDefault();
    $("#user-search").val("");
    t.search.set(false);
  },
  "click #btn-confirm-selected"(e, t) {
    e.preventDefault();
    let users = t.selectedUsers.get();
    let cb = t.data.callback;
    cb && cb(users);
  }
});
