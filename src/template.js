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

        this.volumeBar = this.container.querySelector('.lineplayer-volume-bar-inner');
        this.volumeBarWrap = this.container.querySelector('.lineplayer-volume-bar');
        this.volumeBarWrapWrap = this.container.querySelector('.lineplayer-volume-bar-wrap');
        this.volumeButton = this.container.querySelector('.lineplayer-volume');
        this.volumeIcon = this.container.querySelector('.lineplayer-volume-icon .lineplayer-icon-content');
        this.video = this.container.querySelector('.lineplayer-video-current');
        this.bezel = this.container.querySelector('.lineplayer-bezel-icon');
        this.playButton = this.container.querySelector('.lineplayer-play-icon');
        this.videoWrap = this.container.querySelector('.lineplayer-video-wrap');
        this.controllerMask = this.container.querySelector('.lineplayer-controller-mask');
        this.mask = this.container.querySelector('.lineplayer-mask');
        this.controller = this.container.querySelector('.lineplayer-controller');
        this.browserFullButton = this.container.querySelector('.lineplayer-full-icon');
        this.menu = this.container.querySelector('.lineplayer-menu');
        this.camareButton = this.container.querySelector('.lineplayer-camera-icon');
        this.quality = this.container.querySelector('.lineplayer-quality');
        this.liveBadge = this.container.querySelector('.lineplayer-live-badge');
        this.notice = this.container.querySelector('.lineplayer-notice');
        this.title = this.container.querySelector('.lineplayer-title');
    }

    tpl (options, index, tran, icons) {
        return `
        <div class="lineplayer-mask"></div>
        <div class="lineplayer-video-wrap">
            ${this.tplVideo(true, undefined, options.screenshot, undefined)}
            ${options.title ? `<div class="lineplayer-title"></div>` : ``}
            ${options.logo ? `<div class="lineplayer-logo"><img src="${options.logo}"></div>` : ``}

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
            <div class="lineplayer-icons lineplayer-icons-left">
                <button class="lineplayer-icon lineplayer-play-icon" data-balloon="${tran('Play')}" data-balloon-pos="up">
                    <span class="lineplayer-icon-content">${icons.get('play')}</span>
                </button>
                ${options.volume ? `
                <div class="lineplayer-volume">
                    <button class="lineplayer-icon lineplayer-volume-icon">
                        <span class="lineplayer-icon-content">${icons.get('volume-down')}</span>
                    </button>
                    <div class="lineplayer-volume-bar-wrap" data-balloon-pos="up">
                        <div class="lineplayer-volume-bar">
                            <div class="lineplayer-volume-bar-inner" style="background: ${options.theme};">
                                <span class="lineplayer-thumb" style="background: ${options.theme}"></span>
                            </div>
                        </div>
                    </div>
                </div>` : ``}
                <span class="lineplayer-live-badge"><span class="lineplayer-live-dot" style="background: ${options.theme};"></span>${tran('Live')}</span>
            </div>
            <div class="lineplayer-icons lineplayer-icons-right">
                <div class="lineplayer-quality"></div>

                ${options.screenshot ? `
                <a href="#" class="lineplayer-icon lineplayer-camera-icon" data-balloon="${tran('Screenshot')}" data-balloon-pos="up">
                    <span class="lineplayer-icon-content">${icons.get('camera')}</span>
                </a>
                ` : ``}

                <div class="lineplayer-full">
                    <button class="lineplayer-icon lineplayer-full-icon" data-balloon="${tran('Full screen')}" data-balloon-pos="up">
                        <span class="lineplayer-icon-content">${icons.get('full')}</span>
                    </button>
                </div>
            </div>
        </div>

        ${this.tplContextmenuList(options.contextmenu, tran)}

        <div class="lineplayer-notice"></div>`;
    }

    tplContextmenuList (contextmenu, tran) {
        let result = '<div class="lineplayer-menu">';
        for (let i = 0; i < contextmenu.length; i++) {
            result += `<div class="lineplayer-menu-item"><a target="_blank" href="${contextmenu[i].link}">${tran(contextmenu[i].text)}</a></div>`;
        }
        result += '</div>';

        return result;
    }

    tplQuality (list, current) {
        var quality_list = '<div class="lineplayer-quality-list">';
        for (var i = 0; i < list.length; i++) {
            quality_list += `<div class="lineplayer-quality-item" data-index="${i}">${list[i].name}</div>`;
        }
        quality_list += '</div>';

        return `
            <div class="lineplayer-quality">
                <button class="lineplayer-icon lineplayer-quality-icon">${list[current].name}</button>
                <div class="lineplayer-quality-mask">
                    ${quality_list}
                </div>
            </div>`;
    }

    tplVideo (current, pic, screenshot, url) {
        return `
        <video class="lineplayer-video ${current ? `lineplayer-video-current"` : ``}" ${pic ? `poster="${pic}"` : ``} webkit-playsinline playsinline ${screenshot ? `crossorigin="anonymous"` : ``} src="${url}">
         </video>`;
    }
}

module.exports = Template;
