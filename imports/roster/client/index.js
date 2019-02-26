import '../roster';
import './roster';
import './roster-modal';
import './style.css';

RosterController = ApplicationController.extend({
  template: 'Roster',
  perPage: 25,
  subscriptions() {
    // this.subscribe("roster");
  },
  limit: function() {
    return parseInt(this.params.query.limit) || this.perPage;
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

    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Users.find({"profile.type": type}).count() > this.limit();

    return {
      type,
      users: Users.find({"profile.type": type}, {sort: {"profile.name": 1}, limit: this.limit()}),
      user,
      hasRight: !!user,
      hasSidebar: false,
      nextPath: hasMore ? nextPath : null
    };
  }
});

Router.route('/roster/:_type/:_id?', {
  name: 'roster',
  controller: 'RosterController'
});
