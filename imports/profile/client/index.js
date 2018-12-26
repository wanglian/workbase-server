import '../account';
import './avatar-files';
import './profile';
import './style.css';

Router.route('/profile', function() {
  let account = Threads.findOne({category: 'Account', userId: Meteor.userId()});
  Router.go('inbox', {_id: account._id});
}, {
  name: 'profile'
});
