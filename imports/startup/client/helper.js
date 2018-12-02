import i18next from 'i18next';

Template.registerHelper('_', (key, options) => {
  return i18next.t(key, options.hash);
});