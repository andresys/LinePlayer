import axios from 'axios';

export default {
    load: (options) => new Promise((resolve) => {
        let cameras = [];
        
        const makeurl = (path = '/api/channels', additional_params = {}) => {
            let url_params = [];
            for (let key in additional_params) {
                if (additional_params.hasOwnProperty(key)) {
                    url_params.push(`${key}=${encodeURIComponent(additional_params[key])}`);
                }
            }
        
            return `${options.proto || '//'}${options.host}${options.port ? ':' + options.port : ''}${path}${url_params.length != 0 ? '?' + url_params.join('&') : ''}`;
        };

        const read_or_create_jwt = (callback) => {
            const token = localStorage.getItem('jwt');
            let exp = token ? require('jsonwebtoken').decode(token).exp : null;
        
            if(exp * 1000 < Date.now()) {
                const headers = {
                    'Content-Type': 'application/json'
                };
                const payload = {
                    'username': options.user,
                    'password': options.password
                };
                axios.post(makeurl('/api/auth/login'), payload, { headers }).then(res => {
                    localStorage.setItem('jwt', res.data.token);
                    callback(res.data.token);
                });
            } else {
                callback(token);
            }
        };

        read_or_create_jwt((token) => {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            axios.get(makeurl(), { headers }).then(res => {
                const channels = [options.channels === 0 && [0] || options.channels || []].reduce((flat, current) => flat.concat(current), []);
                cameras = [].concat.apply([], res.data).map((val, index) => {
                    if (channels.length == 0 || channels.indexOf(index) >= 0) {
                        return {
                            name: val.name,
                            quality: [{
                                name: 'HD',
                                url: makeurl('/api/hls/playlist', {src: val['marker'], stream: 0, onlyKeyFrames: false})
                            }, {
                                name: 'SD',
                                url: makeurl('/api/hls/playlist', {src: val['marker'], stream: 1, onlyKeyFrames: false})
                            }]
                        };
                    }
                }).filter(x => x);
    
                resolve(cameras);
            });
        });
    })
};