import utils, { isMobile } from './utils';
import icons from './icons';

module.exports = (options) => {
    // compatibility: some mobile browsers don't suppose autoplay
    if (isMobile) options.autoplay = false;

    // default options
    const defaultOption = {
        container: options.element || document.getElementsByClassName('lineplayer')[0],
        autoplay: false,
        title: true,
        theme: '#b7daff',
        lang: (navigator.language || navigator.browserLanguage).toLowerCase(),
        screenshot: true,
        volume: false,
        hotkey: true,
        icons: icons(),
        iconsColor: '#ffffff',
        iconDisableColor: '#a0a0a0',
        contextmenu: [],
        mutex: true
    };
    options = utils.extendArray(defaultOption, options);

    if (options.lang) {
        options.lang = options.lang.toLowerCase();
    }

    if (options.logo) {
        document.addEventListener('DOMContentLoaded', () => {
            const logo = options.container.querySelector('.lineplayer-logo').querySelector('img');
            logo.onload = () => {
                var w = logo.width;
                var h = logo.height;
                var title = options.container.querySelector('.lineplayer-title');
                if (title) {
                    title.style.paddingLeft = `${40 + w}px`;
                    title.style.top = `${20 + Math.round(h - utils.fullHeight(title)) / 2}px`;
                }
            };
        });
    }

    options.contextmenu = options.contextmenu.concat([
        {
            text: 'About LinePlayer',
            link: 'https://github.com/andresys/LinePlayer'
        }
    ]);

    return options;
};