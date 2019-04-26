import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { LOCALE_EN_US } from './locales/en-US';
import { LOCALE_ZH_CN } from './locales/zh-CN';

i18next.use(LngDetector);
i18next.init({
  // lng: 'zh-CN',
  fallbackLng: "en-US",
  debug: false,
  resources: {
    "en-US": {translation: LOCALE_EN_US},
    "zh-CN": {translation: LOCALE_ZH_CN}
  }
}, function(err, t) {
  // initialized and ready to go!
  if (err) {
    console.log(err);
  }
});

I18n = i18next;
export { I18n };