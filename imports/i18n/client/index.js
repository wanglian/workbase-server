import '../i18next';

let moment = require('moment');

Template.registerHelper('_', (key, options) => {
  return I18n.t(key, options.hash);
});

currentLanguage = () => {
  return window.navigator.language;
};
Template.registerHelper('currentLanguage', currentLanguage);

const setLocale = (lng) => {
  I18n.changeLanguage(lng);
  // moment
  moment.locale(lng.toLowerCase());
}

// default: browser
setLocale(currentLanguage());

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Meteor.user();
  let lng = user.profile.language;
  if (lng) {
    setLocale(lng);
  }
});
