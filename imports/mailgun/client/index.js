import '../';
import './view';
import './style.css';

MailgunController = ApplicationController.extend({
  template: "MailgunEmails",
  perPage: 25,
  subscriptions() {
    this.sub = this.subscribe("mailgun.emails");
  },
  limit() {
    return parseInt(this.params.query.limit) || this.perPage;
  },
  nextPath() {
    // to be implemented
  },
  data() {
    return {
      emails:   MailgunEmails.find({}, {sort: {createdAt: -1}}),
      ready:    this.sub.ready(),
      nextPath: this.nextPath()
    };
  }
});
Router.route('/mailgun', {
  name: 'mailgun',
  controller: 'MailgunController'
});
