import './message-day-chart';

ChartsController = ApplicationController.extend({
  template: 'MessageDayChart'
});

Router.route('/charts', {
  name: 'charts',
  controller: 'ChartsController'
});
