class Events {
    constructor () {
        this.events = {};

        this.videoEvents = [
            'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error',
            'loadeddata', 'loadedmetadata', 'loadstart', 'mozaudioavailable', 'pause', 'play',
            'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend',
            'timeupdate', 'volumechange', 'waiting'
        ];
        this.playerEvents = [
            'screenshot',
            'thumbnails_show', 'thumbnails_hide',
            'contextmenu_show', 'contextmenu_hide',
            'notice_show', 'notice_hide',
            'quality_start', 'quality_end',
            'destroy',
            'resize',
            'fullscreen', 'fullscreen_cancel'
        ];
        this.serverEvents = [
            'lineserver_load_start', 'lineserver_load_end'
        ];
    }

    on (name, callback) {
        if (this.type(name) && typeof callback === 'function') {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        }
    }

    trigger (name, info) {
        if (this.events[name] && this.events[name].length) {
            for (let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](info);
            }
        }
    }

    type (name) {
        if (this.playerEvents.indexOf(name) !== -1) {
            return 'player';
        }
        else if (this.videoEvents.indexOf(name) !== -1) {
            return 'video';
        }
        else if (this.serverEvents.indexOf(name) !== -1) {
            return 'server';
        }

        console.error(`Unknown event name: ${name}`);
        return null;
    }
}

module.exports = Events;
