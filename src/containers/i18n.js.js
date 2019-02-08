import I18n from 'react-native-i18n';
import en from './en';

import fr from './fr';

I18n.fallbacks = true;

I18n.translations = {
    en,
    fr
};

I18n.langs = [
    'en',
    'fr'
];

I18n.switchLanguage = () => {
    const index = I18n.langs.indexOf(I18n.locale);
    if (index === I18n.langs.length - 1)
        I18n.locale = I18n.langs[0];
    else
        I18n.locale = I18n.langs[index + 1];
};

export default I18n;