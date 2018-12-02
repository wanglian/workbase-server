import './inbox';

InboxController = ApplicationController.extend({
  template: 'Inbox'
});

Router.route('/inbox', {
  name: 'inbox',
  controller: 'InboxController'
});