import './setup';
import './login';
import './landing';
import './layout';

Router.configure({
  layoutTemplate: 'DefaultLayout',
  waitOn: function() {
    return Meteor.subscribe('site');
  }
});

Router.route('/', function() {
  this.render('Landing');
}, {
  name: 'landing'
});

Router.route('/login', function() {
  if (!Instance.enabled()) {
    this.redirect('setup');
  } else if (Meteor.userId()) {
    this.redirect('inbox');
  } else {
    this.render('Login');
  }
}, {
  name: 'login'
});

Router.route('/setup', function() {
  if (Meteor.userId()) {
    this.redirect('inbox');
  } else if (Instance.enabled()) {
    this.redirect('login');
  } else {
    this.render('Setup');
  }
}, {
  name: 'setup'
});
