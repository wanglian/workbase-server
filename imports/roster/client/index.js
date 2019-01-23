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
  detail() {
    return this.params.query.detail;
  },
  data() {
    let user = Users.findOne(this.userId());
    return {
      users: Users.find({"profile.type": 'Users'}, {sort: {"profile.name": 1}}),
      user,
      hasRight: !!user,
      hasSidebar: false
    };
  }
});

Router.route('/roster/:_id?', {
  name: 'roster',
  controller: 'RosterController'
});
