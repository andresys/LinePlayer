import './LinePlayer.scss';

import utils, { isMobile } from './utils';
import handleOption from './options';
import i18n from './i18n';
import Template from './template';
import SvgCollection from './svg';
import Events from './events';
import FullScreen from './fullscreen';
import User from './user';
import Bar from './bar';
import Bezel from './bezel';
import Controller from './controller';
import Setting from './setting';
import HotKey from './hotkey';
import ContextMenu from './contextmenu';
import LineServer from './lineserver';

let index = 0;
const instances = [];

class LinePlayer {

    /**
     * LinePlayer constructor function
     *
     * @param {Object} options - See README
     * @constructor
     */
    constructor (options) {
        this.options = handleOption(options);

        this.tran = new i18n(this.options.lang).tran;
        this.icons = new SvgCollection(this.options);
        this.events = new Events();
        this.user = new User(this);
        this.container = this.options.container;

        this.container.classList.add('lineplayer');
        if (this.options.live) {
            this.container.classList.add('lineplayer-live');
        }
        if (isMobile) {
            this.container.classList.add('lineplayer-mobile');
        }
        this.arrow = this.container.offsetWidth <= 500;
        if (this.arrow) {
            this.container.classList.add('lineplayer-arrow');
        }

        this.template = new Template({
            container: this.container,
            options: this.options,
            index: index,
            tran: this.tran,
            icons: this.icons
        });

        this.video = this.template.video;

        this.bar = new Bar(this);

        this.bezel = new Bezel(this.template.bezel);

        this.fullScreen = new FullScreen(this);

        this.controller = new Controller(this);

        this.setting = new Setting(this);

        document.addEventListener('click', () => {
            this.focus = false;
        }, true);
        this.container.addEventListener('click', () => {
            this.focus = true;
        }, true);

        this.paused = true;

        this.hotkey = new HotKey(this);

        this.contextmenu = new ContextMenu(this);

        this.initVideoEvents(this.video);

        if (this.options.line) {
            this.lineserver = new LineServer({
                callback: () => {
                    setTimeout(() => {
                        this.switchVideo(0);

                        // autoplay
                        if (this.options.autoplay && !isMobile) {
                            this.play();
                        }
                        else if (isMobile) {
                            this.pause();
                        }
                    }, 0);
                },
                error: (msg) => {
                    this.notice(msg);
                },
                line: this.options.line,
                events: this.events
            });
        }

        index++;
        instances.push(this);
    }

    initVideoEvents () {
        /**
         * video events
         */
        // video download error: an error occurs
        this.on('error', () => {
            this.tran && this.notice && this.notice(this.tran('This video fails to load'), -1);
        });

        this.on('play', () => {
            if (this.paused) {
                this.play();
            }
        });

        this.on('pause', () => {
            if (!this.paused) {
                this.pause();
            }
        });

        this.on('lineserver_load_start', () => {
            this.container.classList.add('lineplayer-loading');
        });

        this.on('lineserver_load_end', () => {
            this.container.classList.remove('lineplayer-loading');
        });

        for (let i = 0; i < this.events.videoEvents.length; i++) {
            this.video.addEventListener(this.events.videoEvents[i], () => {
                this.events.trigger(this.events.videoEvents[i]);
            });
        }

        if (this.options.volume) {
            this.volume(this.user.get('volume'), true, true);
        } else {
            this.video.muted = true;
        }
    }

    /**
     * Switch to a new video
     *
     * @param {int} channel - new video channel
     * @param {int} quality - new video quality
     */
    switchVideo (channel, quality = 0) {
        channel = Math.max(0, Math.min(this.lineserver.cameras.length - 1, channel));
        quality = Math.max(0, Math.min(this.lineserver.cameras[channel].quality.length - 1, quality));
        if ((channel == this.currentChannel) && (quality == this.qurentQuality)) {
            return;
        }
        this.currentChannel = channel;
        this.currentQuality = quality;

        if(Hls && Hls.isSupported()) {
            var paused = this.video.paused;
            if (!paused) this.pause();

            this.video.poster = this.lineserver.cameras[channel].image;
            this.url = this.lineserver.cameras[channel].quality[quality].url;
            this.title(this.lineserver.cameras[channel].name);
            this.controller.initQualityButton(this.lineserver.cameras[channel].quality, quality);

            if (!paused) this.play();
        }
    }


    /**
     * Play video
     */
    play () {
        this.paused = false;
        if (this.video.paused) {
            this.bezel.switch(this.icons.get('play'));
        }

        if(Hls && Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.loadSource(this.url);
            this.hls.attachMedia(this.video);
        }

        this.template.playButton.innerHTML = this.icons.get('pause');
        this.template.playButton.setAttribute('data-balloon', this.tran('Pause'));

        this.video.play();
        this.container.classList.add('lineplayer-playing');

        this.template.liveBadge.style.display = 'inline-block';

        if (this.options.mutex) {
            for (let i = 0; i < instances.length; i++) {
                if (this !== instances[i]) {
                    instances[i].pause();
                }
            }
        }
    }

    /**
     * Pause video
     */
    pause () {
        this.paused = true;
        if (!this.video.paused) {
            this.bezel.switch(this.icons.get('pause'));
        }

        if(Hls && Hls.isSupported()) {
            const canvas = document.createElement("canvas");
            canvas.width = this.video.clientWidth;
            canvas.height = this.video.clientHeight;
            canvas.getContext('2d').drawImage(this.video, 0, 0, canvas.width, canvas.height);

            //this.video.style.height = `${canvas.height}px`;
            this.video.poster = canvas.toDataURL();
            this.hls.stopLoad();
            this.hls.detachMedia();
        }

        this.template.playButton.innerHTML = this.icons.get('play');
        this.template.playButton.setAttribute('data-balloon', this.tran('Play'));

        this.video.pause();
        this.container.classList.remove('lineplayer-playing');

        this.template.liveBadge.style.display = 'none';
    }

    switchVolumeIcon () {
        if (this.volume() >= 0.95) {
            this.template.volumeIcon.innerHTML = this.icons.get('volume-up');
        }
        else if (this.volume() > 0) {
            this.template.volumeIcon.innerHTML = this.icons.get('volume-down');
        }
        else {
            this.template.volumeIcon.innerHTML = this.icons.get('volume-off');
        }
    }

    /**
     * Set volume
     */
    volume (percentage, nostorage, nonotice) {
        percentage = parseFloat(percentage);
        if (!isNaN(percentage)) {
            percentage = Math.max(percentage, 0);
            percentage = Math.min(percentage, 1);
            this.bar.set('volume', percentage, 'width');
            const formatPercentage = `${this.tran('Volume')} ${(percentage * 100).toFixed(0)}%`;
            this.template.volumeBarWrapWrap.dataset.balloon = formatPercentage;
            if (!nostorage) {
                this.user.set('volume', percentage);
            }

             if (!nonotice) {
                 this.notice(`${this.tran('Volume')} ${(percentage * 100).toFixed(0)}%`);
             }

            this.video.volume = percentage;
            if (this.video.muted) {
                this.video.muted = false;
            }
            this.switchVolumeIcon();
        }

        return this.video.volume;
    }

    /**
     * Toggle between play and pause
     */
    toggle () {
        if (this.video.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    }

    /**
     * attach event
     */
    on (name, callback) {
        this.events.on(name, callback);
    }

    notice (text, time = 2000, opacity = 0.8) {
        this.template.notice.innerHTML = text;
        this.template.notice.style.opacity = opacity;
        if (this.noticeTime) {
            clearTimeout(this.noticeTime);
        }
        this.events.trigger('notice_show', text);
        this.noticeTime = setTimeout(() => {
            this.template.notice.style.opacity = 0;
            this.events.trigger('notice_hide');
        }, time);
    }

    title (text) {
        if(this.template.title) this.template.title.innerHTML = text;
    }

    resize () {
        this.events.trigger('resize');
    }

    destroy () {
        instances.splice(instances.indexOf(this), 1);
        this.pause();
        this.controller.destroy();
        this.video.src = '';
        this.container.innerHTML = '';
        this.events.trigger('destroy');

        for (const key in this) {
            if (this.hasOwnProperty(key) && key !== 'paused') {
                delete this[key];
            }
        }
    }
}

module.exports = LinePlayer;