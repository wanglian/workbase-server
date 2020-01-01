import '../i18next';

let moment = require('moment');

Template.registerHelper('_', (key, options) => {
  return I18n.t(key, options.hash);
});

const setLocale = (lng) => {
  I18n.changeLanguage(lng);
  // moment
  moment.locale(lng.toLowerCase());
};

Meteor.startup(() => {
  // default: browser
  setLocale(window.navigator.language);
});

Accounts.onLogin(function(attempt) {
  let user = Meteor.user();
  if (user) {
    setLocale(user.language());
  }
});
