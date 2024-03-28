import LineServer from './line';
import DominationServer from './domination';
import HLS from './hls';

export default {
    types: ['line', 'domination', 'hls'],

    load: (server_type, options) => {
        switch(server_type) {
        case 'line':
            return LineServer.load(options);
        case 'domination':
            return DominationServer.load(options);
        case 'hls':
                return HLS.load(options);
        }
    }
};