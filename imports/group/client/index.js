import '../';
import './index.html';
import './style.css';

Template.LinkToCreateGroup.events({
  "click #btn-create-group"(e, t) {
    e.preventDefault();

    let users = t.data.members();
    Modal.show('SelectUsersModal', {
      excludeIds: users.map(tu => tu.userId),
      callback(selectedUsers) {
        console.log(selectedUsers.length);
        let userIds = _.union(users.map(u => u._id), selectedUsers.map(u => u._id));
        Meteor.call("startGroup", userIds, (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(res);
          }
          $('#SelectUsersModal button[class=close]').click();
        })
      }
    }, {
      backdrop: 'static'
    });
  }
});
