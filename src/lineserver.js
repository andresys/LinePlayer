import utils from './utils';

const apiBackend = require('./api.js');

class LineServer {
    constructor (options) {
        this.options = options;
        this.cameras = [];
        this.showing = true;
        this.events = this.options.events;

        this.load();
    }

    load () {
        let cameras_url = this.makeurl();
        let headers = {};
        
        this.events && this.events.trigger('lineserver_load_start');

        apiBackend.read(cameras_url, headers, (err, data) => {
            if (err) {
                if (err.response) {
                    this.options.error(err.response.msg);
                }
                else {
                    this.options.error('Request was unsuccessful: ' + err.status);
                }
            }
            else {
                const channels = [this.options.server.channels === 0 && [0] || []].reduce((flat, current) => flat.concat(current), []);
                this.cameras = [].concat.apply([], data).map((val) => {
                    if (channels.length == 0 || channels.indexOf(parseInt(/cameras\/(\d+)/i.exec(val.uri)[1])) >= 0) {
                        return {
                            name: val.name,
                            image: this.makeurl(val['image-uri']),
                            quality: [{
                                name: 'HD',
                                url: this.makeurl(`${val['streaming-uri']}/main.m3u8`)
                            }, {
                                name: 'SD',
                                url: this.makeurl(`${val['streaming-uri']}/sub.m3u8`)
                            }]
                        };
                    }
                }).filter(x => x);

                this.options.callback();

                this.events && this.events.trigger('lineserver_load_end');
            }
        });
    }

    makeurl (path = '/cameras', additional_params = {}) {
        var address = `${this.options.server.proto || '//'}${this.options.server.host}${this.options.server.port ? ':' + this.options.server.port : ''}`;
        var params = utils.extendArray({authorization: `Basic ${btoa(`${this.options.server.user}:${this.options.server.password}`)}`}, additional_params);

        var url_params = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                url_params.push(`${key}=${encodeURIComponent(params[key])}`);
            }
        }

        return `${address}${path}?${url_params.join('&')}`;
    }
}

module.exports = LineServer;