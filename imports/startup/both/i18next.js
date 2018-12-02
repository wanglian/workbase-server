import i18next from 'i18next';

i18next.init({
  lng: 'en',
  debug: false,
  resources: {
    en: {
      translation: {
        "key": "hello world"
      }
    }
  }
}, function(err, t) {
  // initialized and ready to go!
  // document.getElementById('output').innerHTML = i18next.t('key');
  if (err) {
    console.log(err);
  }
});