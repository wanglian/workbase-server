import i18next from 'i18next';
import LngDetector from 'i18next-browser-languagedetector';
import { locale_en_us } from './locales/en-US';
import { locale_zh_cn } from './locales/zh-CN';

i18next.use(LngDetector);
i18next.init({
  // lng: 'zh-CN',
  fallbackLng: "en-US",
  debug: false,
  resources: {
    "en-US": {translation: locale_en_us},
    "zh-CN": {translation: locale_zh_cn}
  }
}, function(err, t) {
  // initialized and ready to go!
  if (err) {
    console.log(err);
  }
});

I18n = i18next;