import './message-day-chart';

Router.route('/charts', function() {
  this.layout('ApplicationLayout');
  this.render('MessageDayChart');
}, {
  name: 'charts'
});
