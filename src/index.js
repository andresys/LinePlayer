/* global LINEPLAYER_VERSION GIT_HASH */
console.log(`${'\n'} %c LinePlayer ${LINEPLAYER_VERSION} ${GIT_HASH} %c https://github.com/andresys/LinePlayer ${'\n'}${'\n'}`, 'color: #fadfa3; background: #030307; padding:5px 0;', 'background: #fadfa3; padding:5px 0;');

module.exports = require('./lineplayer');