import './view.html';
import './style.css';

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
    return _.includes(['Email', 'Group'], thread.category);
  }
});

Template.ThreadDetailMembers.events({
  "click #btn-add-member"(e, t) {
    e.preventDefault();
    e.stopPropagation();
    let threadId = this._id;
    Modal.show('SelectUsersModal', {
      excludeIds: t.data.threadUsers().map((tu) => tu.userId),
      callback(selectedUsers) {
        console.log(selectedUsers.length);
        Meteor.call('addThreadMembers', threadId, selectedUsers.map((u) => u._id), (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
          $('#SelectUsersModal button[class=close]').click();
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
    e.stopPropagation();

    let userType = $(e.target).data("type");
    let userId = $(e.target).data("id");
    let user = Users.findOne(userId);

    Swal({
      title: I18n.t("thread_confirm_remove_member", {name: user.name()}),
      type: 'warning',
      position: 'center-end',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: I18n.t("app_action_confirm"),
      cancelButtonText: I18n.t("app_action_discard")
    }).then((result) => {
      if (result.value) {
        Meteor.call("removeThreadMember", t.data._id, userType, userId);
      }
    });
  }
});
