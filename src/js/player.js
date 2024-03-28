import Promise from 'promise-polyfill';

import { isMobile } from './utils';
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
import servers from './servers/index';

let index = 0;
const instances = [];

class LinePlayer {

    /**
     * LinePlayer constructor function
     *
     * @param {Object} options - See README
     * @constructor
     */
    constructor(options) {
        this.options = handleOption(options);

        this.tran = new i18n(this.options.lang).tran;
        this.icons = new SvgCollection(this.options);
        this.events = new Events();
        this.user = new User(this);
        this.container = this.options.container;
        this.cameras = this.options.cameras;

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

        // this.events && this.events.trigger('lineserver_load_start');
        let played = false;
        // if((this.cameras.length > 0) && !played) {
        //     played = true;
        //     setTimeout(() => {
        //         this.switchVideo(0);

        //         // autoplay
        //         if (this.options.autoplay && !isMobile) {
        //             this.play();
        //         }
        //         else if (isMobile) {
        //             this.pause();
        //         }
        //     }, 0);
        // }
        servers.types.forEach(type => {
            if(this.options[type]) {
                this.options[type] = [this.options[type] || []].reduce((flat, current) => flat.concat(current), []);
                this.options[type].forEach(server => {
                    servers.load(type, server).then((cameras) => {
                        this.cameras = this.cameras.concat(cameras);
                        if(this.cameras.length > 0 && !played) {
                            played = true;
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
                        }
                    });
                });
            }
        });
        this.events && this.events.trigger('lineserver_load_end');

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
        channel = Math.max(0, Math.min(this.cameras.length - 1, channel));
        quality = Math.max(0, Math.min(this.cameras[channel].quality.length - 1, quality));
        
        if ((channel == this.currentChannel) && (quality == this.currentQuality)) {
            return;
        }
        
        this.currentChannel = channel;
        this.currentQuality = quality;

        if(Hls && Hls.isSupported()) {
            var paused = this.video.paused;
            if (!paused) this.pause();

            if(this.cameras[channel].image) this.video.poster = this.cameras[channel].image;
            this.url = this.cameras[channel].quality[quality].url;
            if(this.cameras[channel].name) this.title(this.cameras[channel].name);

            this.controller.initQualityButton(this.cameras[channel].quality, quality);
            if (this.cameras.length > 1) {
                this.controller.initPrevButton(channel > 0);
                this.controller.initNextButton(channel < this.cameras.length - 1);
            }

            if (!paused) this.play();
        }
    }


    /**
     * Play video
     */
    play (fromNative) {
        this.paused = false;
        if (this.video.paused) {
            this.bezel.switch(this.icons.get('play'));
        }

        if(Hls && Hls.isSupported()) {
            this.hls = new Hls();
            this.hls.loadSource(this.url);
            this.hls.attachMedia(this.video);
        }

        this.controller.initPlayButton('Pause', 'pause');

        if (!fromNative) {
            const playedPromise = Promise.resolve(this.video.play());
            playedPromise
                .catch(() => {
                    this.pause();
                })
                .then(() => {});
        }
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
    pause (fromNative) {
        this.paused = true;
        if (!this.video.paused) {
            this.bezel.switch(this.icons.get('pause'));
        }

        if(Hls && Hls.isSupported()) {
            const canvas = document.createElement('canvas');
            canvas.width = this.video.clientWidth;
            canvas.height = this.video.clientHeight;
            canvas.getContext('2d').drawImage(this.video, 0, 0, canvas.width, canvas.height);

            //this.video.style.height = `${canvas.height}px`;
            this.video.poster = canvas.toDataURL();
            this.hls.stopLoad();
            this.hls.detachMedia();
        }

        this.controller.initPlayButton('Play', 'play');

        if (!fromNative) {
            this.video.pause();
        }
        this.container.classList.remove('lineplayer-playing');

        this.template.liveBadge.style.display = 'none';
    }

    switchVolumeIcon () {
        const volumeIcon = this.template.volume.querySelector('.lineplayer-icon-content');
        if (this.volume() >= 0.95) {
            volumeIcon.innerHTML = this.icons.get('volume-up');
        }
        else if (this.volume() > 0) {
            volumeIcon.innerHTML = this.icons.get('volume-down');
        }
        else {
            volumeIcon.innerHTML = this.icons.get('volume-off');
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
            // const formatPercentage = `${this.tran('Volume')} ${(percentage * 100).toFixed(0)}%`;
            //this.template.volumeBarWrapWrap.dataset.balloon = formatPercentage;
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
            if (Object.prototype.hasOwnProperty.call(this, key) && key !== 'paused') {
                delete this[key];
            }
        }
    }
}

export default LinePlayer;