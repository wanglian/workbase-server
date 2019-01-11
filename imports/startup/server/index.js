import '../both';
import './load-models';
import './migrations';
import './welcome';

Meteor.startup(function() {
  if (!Instance.domain()) {
    Instance.insert({
      company: 'WorkBase',
      domain: "workbase.com"
    });
  }
});
