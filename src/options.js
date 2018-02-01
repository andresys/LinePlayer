import utils, { isMobile } from './utils';
import icons from './icons';

module.exports = (options) => {
    // compatibility: some mobile browsers don't suppose autoplay
    if (isMobile) options.autoplay = false;

    // default options
    const defaultOption = {
        container: options.element || document.getElementsByClassName('dplayer')[0],
        autoplay: false,
        title: true,
        theme: '#b7daff',
        lang: (navigator.language || navigator.browserLanguage).toLowerCase(),
        screenshot: false,
        volume: true,
        hotkey: true,
        volume: 0.7,
        line: {
            proto: '//',
            user: 'web'
        },
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
        var logo = new Image();
        logo.onload = () => {
            var w = logo.naturalWidth;
            var h = logo.naturalHeight;
            var title = options.container.querySelector('.lineplayer-title');
            if (title) {
                title.style.paddingLeft = `${40 + w}px`;
                title.style.top = `${20 + Math.round(h - utils.fullHeight(title)) / 2}px`;
            }
        };
        logo.src = options.logo;
    }

    options.contextmenu = options.contextmenu.concat([
        {
            text: 'About LinePlayer',
            link: 'https://andresys.github.io/LinePlayer/'
        }
    ]);

    return options;
};