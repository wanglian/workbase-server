ApplicationController = RouteController.extend({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'spinner',
  notFoundTemplate: 'notFound',
  waitOn() {
    if (!Meteor.user()) {
      this.redirect('/login');
    }
  },
  onAfterAction() {
    $('body').removeClass('sidebar-open');
  }
});
