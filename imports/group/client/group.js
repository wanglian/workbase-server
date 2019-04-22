import './group.html';

import Swal from 'sweetalert2';

Template.LinkToCreateGroup.events({
  "click #btn-create-group"(e, t) {
    e.preventDefault();

    let users = t.data.users;
    Modal.show('SelectUsersModal', {
      excludeIds: users.map(u => u._id),
      callback(selectedUsers) {
        console.log(selectedUsers.length);
        let userIds = _.union(users.map(u => u._id), selectedUsers.map(u => u._id));
        Meteor.call("startGroup", userIds, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
            Router.go('inbox', {_id: res});
          }
          $('#SelectUsersModal button[class=close]').click();
        });
      }
    }, {
      backdrop: 'static'
    });
  }
});

Template.ThreadDetailGroup.events({
  "click #btn-modify-group-name"(e, t) {
    e.preventDefault();

    Swal({
      title: I18n.t("thread_modify_group_name"),
      input: 'text',
      inputValue: this.name(),
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: I18n.t("app_action_save"),
      cancelButtonText: I18n.t("app_action_discard"),
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        Meteor.call("updateGroupName", this._id, result.value);
      }
    });
  }
});
