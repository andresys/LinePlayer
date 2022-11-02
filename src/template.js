class Template {
    constructor (options) {
        this.container = options.container;
        this.options = options.options;
        this.index = options.index;
        this.tran = options.tran;
        this.icons = options.icons;
        this.init();
    }

    init () {
        this.container.innerHTML = this.tpl(this.options, this.index, this.tran, this.icons);

        this.video = this.container.querySelector('.lineplayer-video-current');
        this.bezel = this.container.querySelector('.lineplayer-bezel-icon');
        this.videoWrap = this.container.querySelector('.lineplayer-video-wrap');
        this.controllerMask = this.container.querySelector('.lineplayer-controller-mask');
        this.mask = this.container.querySelector('.lineplayer-mask');
        this.controller = this.container.querySelector('.lineplayer-controller');
        this.menu = this.container.querySelector('.lineplayer-menu');
        this.notice = this.container.querySelector('.lineplayer-notice');
        this.title = this.container.querySelector('.lineplayer-title');

        this.play = this.container.querySelector('.lineplayer-play');
        this.prev = this.container.querySelector('.lineplayer-prev');
        this.next = this.container.querySelector('.lineplayer-next');
        this.volume = this.container.querySelector('.lineplayer-volume');
        this.liveBadge = this.container.querySelector('.lineplayer-live-badge');
        this.quality = this.container.querySelector('.lineplayer-quality');
        this.screenshot = this.container.querySelector('.lineplayer-screenshot');
        this.fullScreen = this.container.querySelector('.lineplayer-full');        
    }

    tpl (options, index, tran) {
        return `
        <div class="lineplayer-mask"></div>
        <div class="lineplayer-video-wrap">
            ${this.tplVideo(true, undefined, options.screenshot, undefined)}
            ${options.title ? '<div class="lineplayer-title"></div>' : ''}
            ${options.logo ? `<div class="lineplayer-logo"><img src="${options.logo}"></div>` : ''}

            <div class="lineplayer-bezel">
                <span class="lineplayer-bezel-icon"></span>
                <span class="lineplayer-danloading">${tran('LinePlayer is loading')}</span>
                <span class="lineplayer-loading-icon">
                    <svg height="100%" version="1.1" viewBox="0 0 22 22" width="100%">
                        <svg x="7" y="1">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-0" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="11" y="3">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-1" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="13" y="7">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-2" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="11" y="11">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-3" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="7" y="13">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-4" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="3" y="11">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-5" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="1" y="7">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-6" cx="4" cy="4" r="2"></circle>
                        </svg>
                        <svg x="3" y="3">
                            <circle class="lineplayer-loading-dot lineplayer-loading-dot-7" cx="4" cy="4" r="2"></circle>
                        </svg>
                    </svg>
                </span>
            </div>
        </div>

        <div class="lineplayer-controller-mask"></div>
        <div class="lineplayer-controller">
            <ul class="lineplayer-icons lineplayer-icons-left">
                <li class="lineplayer-play"></li>
                <li class="lineplayer-prev"></li>
                <li class="lineplayer-next"></li>
                <li class="lineplayer-volume"></li>
                <li class="lineplayer-live">
                    <span class="lineplayer-live-badge"><span class="lineplayer-live-dot" style="background: ${options.theme};"></span>${tran('Live')}</span>
                </li>
            </ul>
            <ul class="lineplayer-icons lineplayer-icons-right">
                <li class="lineplayer-quality"></li>
                <li class="lineplayer-screenshot"></li>
                <li class="lineplayer-full"></li>
            </ul>
        </div>

        ${this.tplContextmenuList(options.contextmenu)}

        <div class="lineplayer-notice"></div>`;
    }

    tplContextmenuList (contextmenu) {
        let result = '<div class="lineplayer-menu">';
        for (let i = 0; i < contextmenu.length; i++) {
            result += `<div class="lineplayer-menu-item"><a target="_blank" href="${contextmenu[i].link}">${this.tran(contextmenu[i].text)}</a></div>`;
        }
        result += '</div>';

        return result;
    }

    tplButton (name, icon, disable = false, content = (content) => { return content('tplHint', null);}) {
        const contentPanel = (show) => {
            return show ? content((tplFunction, options) => {
                if (tplFunction && {}.toString.call(this[tplFunction]) === '[object Function]') {
                    return this[tplFunction](name, icon, options);
                }
                return this.tplHint(name, icon);
            }) : '';
        };
        return `
            <button class="lineplayer-icon${ disable ? ' disable' : '' }">
                <span class="lineplayer-icon-content">${this.icons.get(icon, disable)}</span>
            </button>
            ${contentPanel(!disable)}`;
    }

    tplCameraPreview (name, icon, options) {
        var image = options['image'],
            description = options['description'];

        return `
            <div class="lineplayer-button-mask">
                <div class="lineplayer-button-panel lineplayer-button-${icon}-panel">
                    <span>${this.tran(name)}</span>
                    ${image ? `<img src="${image}" alt="${this.tran(name)}"/>` : ''}
                    <span>${description}</span>
                </div>
            </div>`;
    }

    tplVolume () {
        return `
            <div class="lineplayer-volume-bar-wrap" data-balloon-pos="up">
                <div class="lineplayer-volume-bar">
                    <div class="lineplayer-volume-bar-inner" style="background: ${this.options.theme};">
                        <span class="lineplayer-thumb" style="background: ${this.options.theme}"></span>
                    </div>
                </div>
            </div>`;
    }

    tplQuality (name, icon, options) {
        var list = options['list'];
        // var current = options['current'];

        var quality_list = '<div class="lineplayer-button-panel">';
        for (var i = 0; i < list.length; i++) {
            quality_list += `<div class="lineplayer-quality-item" data-index="${i}">${list[i].name}</div>`;
        }
        quality_list += '</div>';

        return `
            <div class="lineplayer-button-mask">
                ${quality_list}
            </div>`;
    }

    tplHint (name, icon) {
        return `
            <div class="lineplayer-button-mask">
                <div class="lineplayer-button-panel lineplayer-button-${icon}-panel">
                    <span>${this.tran(name)}</span>
                </div>
            </div>`;
    }

    tplVideo (current, pic, screenshot, url) {
        return `
        <video class="lineplayer-video ${current ? 'lineplayer-video-current"' : ''}" ${pic ? `poster="${pic}"` : ''} webkit-playsinline playsinline ${screenshot ? 'crossorigin="anonymous"' : ''} src="${url}">
         </video>`;
    }
}

module.exports = Template;
