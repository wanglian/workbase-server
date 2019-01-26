import './setup';
import './login';
import './landing';
import './layout';

Router.configure({
  layoutTemplate: 'DefaultLayout',
});

Router.route('/', {
  name: 'landing',
  template: 'Landing',
  waitOn() {
    return Meteor.subscribe("site");
  }
});

Router.route('/login', {
  name: 'login',
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
  waitOn() {
    return Meteor.subscribe("site");
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
