import '../live-chat';
import './view';

Router.route('/contact', function() {
  this.render('Contact');
}, {
  name: 'contact'
});
