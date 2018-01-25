import utils, { isMobile } from './utils';
import download from './download';

class Controller {
    constructor (player) {
        this.player = player;

        this.autoHideTimer = 0;
        if (!isMobile) {
            this.player.container.addEventListener('mousemove', () => {
                this.setAutoHide();
            });
            this.player.container.addEventListener('click', () => {
                this.setAutoHide();
            });
            this.player.template.controller.addEventListener('mouseenter', () => {
                this.disableAutoHide = true;
            });
            this.player.template.controller.addEventListener('mouseleave', () => {
                this.disableAutoHide = false;
            });
            this.player.template.controllerMask.addEventListener('mouseenter', () => {
                this.disableAutoHide = true;
            });
            this.player.template.controllerMask.addEventListener('mouseleave', () => {
                this.disableAutoHide = false;
            });
            this.player.template.mask.addEventListener('mouseenter', () => {
                this.disableAutoHide = true;
            });
        }

        this.initPlayButton();
        this.initFullButton();
        this.initVolumeButton();
        this.initScreenshotButton();
    }

    initPlayButton () {
        this.player.template.playButton.addEventListener('click', () => {
            this.player.toggle();
        });

        if (!isMobile) {
            this.player.template.videoWrap.addEventListener('click', () => {
                this.player.toggle();
            });
            this.player.template.controllerMask.addEventListener('click', () => {
                this.player.toggle();
            });
        }
        else {
            this.player.template.videoWrap.addEventListener('click', () => {
                this.toggle();
            });
            this.player.template.controllerMask.addEventListener('click', () => {
                this.toggle();
            });
        }
    }

    initFullButton () {
        this.player.template.browserFullButton.addEventListener('click', () => {
            this.player.fullScreen.toggle('browser');
        });
    }

    initVolumeButton () {
        if (this.player.options.volume) {
            const vWidth = 35;

            const volumeMove = (event) => {
                const e = event || window.event;
                const percentage = (e.clientX - utils.getElementViewLeft(this.player.template.volumeBarWrap) - 5.5) / vWidth;
                this.player.volume(percentage, false, true);
            };
            const volumeUp = () => {
                document.removeEventListener('mouseup', volumeUp);
                document.removeEventListener('mousemove', volumeMove);
                this.player.template.volumeButton.classList.remove('lineplayer-volume-active');
            };

            this.player.template.volumeBarWrapWrap.addEventListener('click', (event) => {
                const e = event || window.event;
                const percentage = (e.clientX - utils.getElementViewLeft(this.player.template.volumeBarWrap) - 5.5) / vWidth;
                this.player.volume(percentage, false, true);
            });
            this.player.template.volumeBarWrapWrap.addEventListener('mousedown', () => {
                document.addEventListener('mousemove', volumeMove);
                document.addEventListener('mouseup', volumeUp);
                this.player.template.volumeButton.classList.add('lineplayer-volume-active');
            });
            this.player.template.volumeIcon.addEventListener('click', () => {
                if (this.player.video.muted) {
                    this.player.video.muted = false;
                    this.player.switchVolumeIcon();
                    this.player.bar.set('volume', this.player.volume(), 'width');
                }
                else {
                    this.player.video.muted = true;
                    this.player.template.volumeIcon.innerHTML = this.player.icons.get('volume-off');
                    this.player.bar.set('volume', 0, 'width');
                }
            });
        }
    }

    initQualityButton (list, current) {
        this.player.template.quality.innerHTML = this.player.template.tplQuality(list, current);
        var qualityList = this.player.template.quality.querySelector('.lineplayer-quality-list');
        if (qualityList) {
            qualityList.addEventListener('click', (e) => {
                if (e.target.classList.contains('lineplayer-quality-item')) {
                    this.player.switchVideo(this.player.currentChannel, parseInt(e.target.dataset.index));
                }
            });
        }
    }

    initScreenshotButton () {
        if (this.player.options.screenshot) {
            this.player.template.camareButton.addEventListener('click', (e) => {
                e.preventDefault();
                const canvas = document.createElement("canvas");
                canvas.width = this.player.video.videoWidth;
                canvas.height = this.player.video.videoHeight;
                canvas.getContext('2d').drawImage(this.player.video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/png');
                const fileName = `${this.player.template.title && this.player.template.title.innerHTML || 'LinePlayer'} - ${utils.currentDateTime()}.png`;
                download(dataURL, fileName, 'image/png');
                this.player.events.trigger('screenshot', dataURL);
            });
        }
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