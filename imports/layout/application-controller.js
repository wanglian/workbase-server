ApplicationController = RouteController.extend({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'spinner',
  notFoundTemplate: 'notFound',
  onBeforeAction() {
    if (!Meteor.user()) {
      this.redirect('/login');
    } else {
      this.next();
    }
  },
  onAfterAction() {
    $('body').removeClass('sidebar-open');
  }
});
