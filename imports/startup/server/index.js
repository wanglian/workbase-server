import '../both';
import './load-models';
import './migrations';
import './welcome';

Meteor.startup(function() {
  let settings = Meteor.settings;
  if (!settings.public.domain) return;

  let company = settings.public.company || 'WorkBase';
  let domain  = settings.public.domain  || 'workbase.com';
  let instance = Instance.findOne();
  if (instance) {
    Instance.update({}, {$set: {company, domain}});
  } else {
    let id = Instance.insert({company, domain});
    instance = Instance.findOne();
  }

  let mailgun = settings.mailgun;
  if (mailgun) {
    Instance.update({}, {$set: {"modules.email": {
      type: 'mailgun',
      mailgun
    }}});
  }

  let s3 = settings.s3;
  if (s3) {
    Instance.update({}, {$set: {"modules.storage": {
      type: 'S3',
      s3
    }}});
  }

  console.log("=== settings.json loaded ===");
});
