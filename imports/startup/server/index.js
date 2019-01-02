import '../both';
import './migrations';
import './welcome';

Meteor.startup(function() {
  if (!Instance.domain()) {
    Instance.insert({
      company: Meteor.settings.public.company,
      domain: Meteor.settings.public.domain
    });
  }
});
