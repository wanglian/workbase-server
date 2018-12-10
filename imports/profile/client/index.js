import './profile';

Router.route('/profile', function () {
  this.layout('ApplicationLayout');
  this.render('Profile');
}, {
  name: 'profile',
});
