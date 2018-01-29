// stats.js: JavaScript Performance Monitor
initPlayers();

function initPlayers () {
    // lineplayer
    window.lineplayer = new LinePlayer({
        container: document.getElementById('lineplayer'),
        volume: false,
        screenshot: true,
        line: {
            host: 'line.adm.tver.ru',
            proto: 'https://',
            port: 443,
            user: 'web',
            password: 'web'
        }
    });
}