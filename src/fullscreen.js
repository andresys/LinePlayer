import utils from './utils';

class FullScreen {
    constructor (player) {
        this.player = player;

        const fullscreenchange = () => {
            this.player.resize();
            if (this.isFullScreen()) {
                this.player.events.trigger('fullscreen');
            }
            else {
                utils.setScrollPosition(this.lastScrollPosition);
                this.player.events.trigger('fullscreen_cancel');
            }
        };
        this.player.container.addEventListener('fullscreenchange', fullscreenchange);
        this.player.container.addEventListener('mozfullscreenchange', fullscreenchange);
        this.player.container.addEventListener('webkitfullscreenchange', fullscreenchange);
    }

    isFullScreen () {
        return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    }

    request () {
        this.lastScrollPosition = utils.getScrollPosition();

    
        if (this.player.container.requestFullscreen) {
            this.player.container.requestFullscreen();
        }
        else if (this.player.container.mozRequestFullScreen) {
            this.player.container.mozRequestFullScreen();
        }
        else if (this.player.container.webkitRequestFullscreen) {
            this.player.container.webkitRequestFullscreen();
        }
        else if (this.player.video.webkitEnterFullscreen) {   // Safari for iOS
            this.player.video.webkitEnterFullscreen();
        }
    
        this.cancel();
    }

    cancel () {

        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    toggle () {
        if (this.isFullScreen()) {
            this.cancel();
        }
        else {
            this.request();
        }
    }
}

export default FullScreen;