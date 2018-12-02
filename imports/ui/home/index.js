import './home';

Router.configure({
  layoutTemplate: 'DefaultLayout'
});

Router.route('/', function () {
  if (Meteor.userId()) {
    this.redirect('/inbox');
  } else {
    this.render('Home');
  }
}, {
  name: 'home',
});