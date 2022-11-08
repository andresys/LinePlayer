const apiBackend = require('./api.js');

class DominationServer {
    constructor (options) {
        this.options = options;
        this.cameras = [];
        this.showing = true;
        this.events = this.options.events;

        this.read_or_create_jwt(token => this.load(token));
    }

    load (token) {
        let cameras_url = this.makeurl();
        let headers = { 'Authorization': `Bearer ${token}` };

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

        return `${this.options.server.proto || '//'}${this.options.server.host}${this.options.server.port ? ':' + this.options.server.port : ''}${path}${url_params.length != 0 ? '?' + url_params.join('&') : ''}`;
    }

    read_or_create_jwt(callback) {
        const token = localStorage.getItem('jwt');
        let exp = token ? require('jsonwebtoken').decode(token).exp : null;

        if(exp * 1000 < Date.now()) {
            const payload = {
                'username': this.options.server.user,
                'password': this.options.server.password
            };
            apiBackend.send(this.makeurl('/api/auth/login'), {}, payload, (err, data) => {
                if (err) {
                    if (err.response) {
                        this.options.error(err.response.msg);
                    }
                    else {
                        this.options.error('Request was unsuccessful: ' + err.status);
                    }
                }
                else {
                    localStorage.setItem('jwt', data.token);
                    callback(data.token);
                }
            });
        } else {
            callback(token);
        }
    }
}

module.exports = DominationServer;