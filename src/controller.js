import utils, { isMobile } from './utils';

class Controller {
    constructor (player) {
        this.player = player;

        this.autoHideTimer = 0;
        if (!isMobile) {
            this.player.container.addEventListener('mousemove', () => { this.setAutoHide(); });
            this.player.container.addEventListener('click', () => { this.setAutoHide(); });
            this.player.template.controller.addEventListener('mouseenter', () => { this.disableAutoHide = true; });
            this.player.template.controller.addEventListener('mouseleave', () => { this.disableAutoHide = false; });
            this.player.template.controllerMask.addEventListener('mouseenter', () => { this.disableAutoHide = true; });
            this.player.template.controllerMask.addEventListener('mouseleave', () => { this.disableAutoHide = false; });
            this.player.template.mask.addEventListener('mouseenter', () => { this.disableAutoHide = true; });
            this.player.template.videoWrap.addEventListener('click', () => { this.player.toggle(); });
            this.player.template.controllerMask.addEventListener('click', () => { this.player.toggle(); });
        }
        else {
            this.player.template.videoWrap.addEventListener('click', () => { this.toggle(); });
            this.player.template.controllerMask.addEventListener('click', () => { this.toggle(); });
        }

        this.initPlayButton();
        this.initVolumeButton();
        this.initScreenshotButton();
        this.initFullButton();
    }

    initPlayButton (name = 'Play', icon = 'play') {
        this.player.template.play.innerHTML = this.player.template.tplButton(name, icon);
        var button = this.player.template.play.querySelector('button');

        button.addEventListener('click', () => {
            this.player.toggle();
        });
    }

    initPrevButton (show) {
        let cameras = this.player.servers.map(server => server.cameras).flat();
        this.player.template.prev.innerHTML = this.player.template.tplButton('Prev', 'prev', !show, (content) => {
            var image = cameras[this.player.currentChannel-1].image;
            var name = cameras[this.player.currentChannel-1].name;
            return content('tplCameraPreview', {'image': image, 'description': name});
        });
        if (show) {
            var prevButton = this.player.template.prev.querySelector('button');
            prevButton.addEventListener('click', () => {
                this.player.switchVideo(this.player.currentChannel-1, this.player.currentQuality);
            });
        }
    }

    initNextButton (show) {
        let cameras = this.player.servers.map(server => server.cameras).flat();
        this.player.template.next.innerHTML = this.player.template.tplButton('Next', 'next', !show, (content) => {
            var image = cameras[this.player.currentChannel+1].image;
            var name = cameras[this.player.currentChannel+1].name;
            return content('tplCameraPreview', {'image': image, 'description': name});
        });
        if (show) {
            var nextButton = this.player.template.next.querySelector('button');
            nextButton.addEventListener('click', () => {
                this.player.switchVideo(this.player.currentChannel+1, this.player.currentQuality);
            });
        }
    }

    initVolumeButton () {
        this.player.template.volume.innerHTML = '';
        if (this.player.options.volume) {
            this.player.template.volume.innerHTML = this.player.template.tplButton('Volume', 'volume-down', false, (content) => {
                return content('tplVolume');
            });

            const vWidth = 35;
            const volumeBar = this.player.template.volume.querySelector('.lineplayer-volume-bar-inner');
            const volumeBarWrap = this.player.template.volume.querySelector('.lineplayer-volume-bar');
            const volumeBarWrapWrap = this.player.template.volume.querySelector('.lineplayer-volume-bar-wrap');
            const volumeIcon = this.player.template.volume.querySelector('.lineplayer-icon-content');

            this.player.bar.add('volume', volumeBar);

            const volumeMove = (event) => {
                const e = event || window.event;
                const percentage = (e.clientX - utils.getElementViewLeft(volumeBarWrap) - 5.5) / vWidth;
                this.player.volume(percentage, false, true);
            };
            const volumeUp = () => {
                document.removeEventListener('mouseup', volumeUp);
                document.removeEventListener('mousemove', volumeMove);
                this.player.template.volume.classList.remove('lineplayer-volume-active');
            };

            volumeBarWrapWrap.addEventListener('click', (event) => {
                const e = event || window.event;
                const percentage = (e.clientX - utils.getElementViewLeft(volumeBarWrap) - 5.5) / vWidth;
                this.player.volume(percentage, false, true);
            });
            volumeBarWrapWrap.addEventListener('mousedown', () => {
                document.addEventListener('mousemove', volumeMove);
                document.addEventListener('mouseup', volumeUp);
                this.player.template.volume.classList.add('lineplayer-volume-active');
            });

            var volumeButton = this.player.template.volume.querySelector('button');
            volumeButton.addEventListener('click', () => {
                if (this.player.video.muted) {
                    this.player.video.muted = false;
                    this.player.switchVolumeIcon();
                    this.player.bar.set('volume', this.player.volume(), 'width');
                }
                else {
                    this.player.video.muted = true;
                    volumeIcon.innerHTML = this.player.icons.get('volume-off');
                    this.player.bar.set('volume', 0, 'width');
                }
            });
        }
    }

    initQualityButton (list, current) {
        this.player.template.quality.innerHTML = '';
        if (list.length > 1) {
            this.player.template.quality.innerHTML = this.player.template.tplButton('Quality change', list[current].name, false, (content) => {
                return content('tplQuality', {'list': list, 'current': current});
            });
            var qualityList = this.player.template.quality.querySelector('.lineplayer-button-panel');
            if (qualityList) {
                qualityList.addEventListener('click', (e) => {
                    if (e.target.classList.contains('lineplayer-quality-item')) {
                        this.player.switchVideo(this.player.currentChannel, parseInt(e.target.dataset.index));
                    }
                });
            }
        }
    }

    initScreenshotButton () {
        if (this.player.options.screenshot) {
            this.player.template.screenshot.innerHTML = this.player.template.tplButton('Screenshot', 'camera');
            var screenshotButton = this.player.template.screenshot.querySelector('button');
            screenshotButton.addEventListener('click', (e) => {
                e.preventDefault();
                const canvas = document.createElement('canvas');
                canvas.width = this.player.video.videoWidth;
                canvas.height = this.player.video.videoHeight;
                canvas.getContext('2d').drawImage(this.player.video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/png');
                const fileName = `${this.player.template.title && this.player.template.title.innerHTML || 'LinePlayer'} - ${utils.currentDateTime()}.png`;
                require('downloadjs')(dataURL, fileName, 'image/png');
                this.player.events.trigger('screenshot', dataURL);
            });
        }
    }

    initFullButton () {
        this.player.template.fullScreen.innerHTML = this.player.template.tplButton('Full screen', 'full');
        var fullScreenButton = this.player.template.fullScreen.querySelector('button');
        fullScreenButton.addEventListener('click', () => {
            this.player.fullScreen.toggle();
        });
    }

    setAutoHide () {
        this.show();
        clearTimeout(this.autoHideTimer);
        this.autoHideTimer = setTimeout(() => {
            if (!this.player.video.paused && !this.disableAutoHide) {
                this.hide();
            }
        }, 2000);
    }

    show () {
        this.player.container.classList.remove('lineplayer-hide-controller');
    }

    hide () {
        this.player.container.classList.add('lineplayer-hide-controller');
    }

    isShow () {
        return !this.player.container.classList.contains('lineplayer-hide-controller');
    }

    toggle () {
        if (this.isShow()) {
            this.hide();
        }
        else {
            this.show();
        }
    }

    destroy () {
        clearTimeout(this.autoHideTimer);
    }
}

module.exports = Controller;