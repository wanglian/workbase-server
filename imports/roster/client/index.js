import '../roster';
import './roster';
import './roster-modal';
import './style.css';

RosterController = ApplicationController.extend({
  template: 'Roster',
  subscriptions() {
    // this.subscribe("roster");
  },
  userId() {
    return this.params._id;
  },
  type() {
    return this.params._type;
  },
  data() {
    let user = Users.findOne(this.userId());
    let type = this.type() === 'external' ? 'Contacts' : 'Users';
    return {
      type,
      users: Users.find({"profile.type": type}, {sort: {"profile.name": 1}}),
      user,
      hasRight: !!user,
      hasSidebar: false
    };
  }
});

Router.route('/roster/:_type/:_id?', {
  name: 'roster',
  controller: 'RosterController'
});
