import './avatar-files';
import './profile';

ProfileController = ApplicationController.extend({
  template: 'Profile'
});

Router.route('/profile', {
  name: 'profile',
  controller: 'ProfileController'
});
