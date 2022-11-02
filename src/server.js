import LineServer from './lineserver';
import DominationServer from './dominationserver';

class Server {
    constructor(server_type, options) {
        switch(server_type) {
        case 'line':
            return new LineServer(options);
        case 'domination':
            return new DominationServer(options);
        }
    }
}

module.exports = Server;