ApplicationController = RouteController.extend({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'spinner',
  notFoundTemplate: 'notFound',
  subscriptions() {
    this.subscribe("roster");
  },
  waitOn: function() {
    if (Meteor.userId()) {
      return this.subscribe('instance');
    } else {
      this.redirect('/login');
    }
  }
});
