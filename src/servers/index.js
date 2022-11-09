import LineServer from './line';
import DominationServer from './domination';

export default {
    types: ['line', 'domination'],

    load: (server_type, options) => {
        switch(server_type) {
        case 'line':
            return LineServer.load(options);
        case 'domination':
            return DominationServer.load(options);
        }
    }
};