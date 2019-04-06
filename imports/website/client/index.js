import './setup';
import './login';
import './landing';
import './layout';

Router.route('/', {
  name: 'landing',
  template: 'Landing',
  waitOn() {
    return Meteor.subscribe("site");
  }
});

Router.route('/login', {
  name: 'login',
  layoutTemplate: 'DefaultLayout',
  waitOn() {
    return Meteor.subscribe("site");
  },
  action() {
    if (!Instance.enabled()) {
      this.redirect('setup');
    } else if (Meteor.userId()) {
      this.redirect('inbox');
    } else {
      this.render('Login');
    }
  }
});

Router.route('/setup', {
  name: 'setup',
  layoutTemplate: 'DefaultLayout',
  waitOn() {
    return Meteor.subscribe("site-setup");
  },
  action() {
    if (Meteor.userId()) {
      this.redirect('inbox');
    } else if (Instance.enabled()) {
      this.redirect('login');
    } else {
      this.render('Setup');
    }
  }
});
