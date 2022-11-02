const apiBackend = require('./api.js');

class DominationServer {
    constructor (options) {
        this.options = options;
        this.cameras = [];
        this.showing = true;
        this.events = this.options.events;

        this.load();
    }

    load () {
        let cameras_url = this.makeurl();
        let headers = this.makeheaders();
        
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
                const channels = [this.options.server.channels || []].reduce((flat, current) => flat.concat(current), []);
                this.cameras = [].concat.apply([], data).map((val, index) => {
                    if (channels.length == 0 || channels.indexOf(index) >= 0) {
                        return {
                            name: val.name,
                            quality: [{
                                name: 'HD',
                                url: this.makeurl('/api/hls/playlist', {src: val['marker'], stream: 0, onlyKeyFrames: false})
                            }, {
                                name: 'SD',
                                url: this.makeurl('/api/hls/playlist', {src: val['marker'], stream: 1, onlyKeyFrames: false})
                            }]
                        };
                    }
                }).filter(x => x);

                this.options.callback();

                this.events && this.events.trigger('lineserver_load_end');
            }
        });
    }

    makeurl(path = '/api/channels', additional_params = {}) {
        let url_params = [];
        for (let key in additional_params) {
            if (additional_params.hasOwnProperty(key)) {
                url_params.push(`${key}=${encodeURIComponent(additional_params[key])}`);
            }
        }

        return `${this.options.server.proto || '//'}${this.options.server.host}${this.options.server.port ? ':' + this.options.server.port : ''}${path}?${url_params.join('&')}`;
    }

    makeheaders() {
        return {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoid2ViIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsIm5iZiI6MTY1NDY3MTk3NywiZXhwIjoxNjU1Mjc2Nzc3LCJpYXQiOjE2NTQ2NzE5NzcsImlzcyI6IkRvbWluYXRpb24iLCJhdWQiOiJEb21pbmF0aW9uIFdlYiBDbGllbnQifQ.PAvUG9SH38tYB3XJFUdm4NlvKvJsZKtUhjQGrXSdDjw'
        };
    }
}

module.exports = DominationServer;