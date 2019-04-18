import '../roster';
import './roster';
import './roster-modal';
import './style.css';

ThreadCategories.add("Roster", {
  icon: "fa fa-address-book",
  iconUnread: "fa fa-address-book",
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  actions() {
    return [
      {
        title: I18n.t('User List'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('RosterListModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('New User'),
        icon: "fa fa-user-plus",
        action() {
          Modal.show('AddRosterModal', null, {
            backdrop: 'static'
          });
        }
      }
    ]
  }
});

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
  search() {
    return this.params.query.search;
  },
  data() {
    let user = Users.findOne(this.userId());
    let type = this.type() === 'external' ? 'Contacts' : 'Users';

    let query = _.clone(this.params.query);
    _.extend(query, {limit: this.limit() + this.perPage});
    let nextPath = this.route.path(this.params, {query});
    let hasMore = Users.find({"profile.type": type}).count() > this.limit();

    let conditions = {"profile.type": type};
    let keyword = this.search();
    if (keyword) {
      _.extend(conditions, {$or: [
        {"profile.name": {$regex: keyword, $options: 'i'}},
        {"emails.address": {$regex: keyword, $options: 'i'}}
      ]});
    }
    return {
      type,
      users: Users.find(conditions, {sort: {"profile.name": 1}, limit: this.limit()}),
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
