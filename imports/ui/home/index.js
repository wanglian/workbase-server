import './home';

Router.configure({
  layoutTemplate: 'DefaultLayout'
});

Router.route('/login', function () {
  if (Meteor.userId()) {
    this.redirect('/inbox');
  } else {
    this.render('Home');
  }
}, {
  name: 'home',
});