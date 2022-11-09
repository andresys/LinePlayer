import axios from 'axios';
import utils from '../utils';

export default {
    load: (options) => new Promise((resolve) => {
        let cameras = [];
        
        const makeurl = (path = '/cameras', additional_params = {}) => {
            var address = `${options.proto || '//'}${options.host}${options.port ? ':' + options.port : ''}`;
            var params = utils.extendArray({authorization: `Basic ${btoa(`${options.user}:${options.password}`)}`}, additional_params);
    
            var url_params = [];
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    url_params.push(`${key}=${encodeURIComponent(params[key])}`);
                }
            }
    
            return `${address}${path}?${url_params.join('&')}`;
        };

        const headers = {
            'Accept': 'application/json'
        };
        axios.get(makeurl(), { headers }).then(res => {
            const channels = [options.channels === 0 && [0] || options.channels || []].reduce((flat, current) => flat.concat(current), []);
            cameras = [].concat.apply([], res.data).map((val) => {
                if (channels.length == 0 || channels.indexOf(parseInt(/cameras\/(\d+)/i.exec(val.uri)[1])) >= 0) {
                    return {
                        name: val.name,
                        image: makeurl(val['image-uri']),
                        quality: [{
                            name: 'HD',
                            url: makeurl(`${val['streaming-uri']}/main.m3u8`)
                        }, {
                            name: 'SD',
                            url: makeurl(`${val['streaming-uri']}/sub.m3u8`)
                        }]
                    };
                }
            }).filter(x => x);

            resolve(cameras);
        });
    })
};