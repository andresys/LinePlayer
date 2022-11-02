// stats.js: JavaScript Performance Monitor
initPlayers();

function initPlayers () {
    // lineplayer
    window.lineplayer = new LinePlayer({
        container: document.getElementById('lineplayer'),
        volume: false,
        screenshot: true,
        autoplay: true,
        line: {
            host: 'line.adm.tver.ru',
            user: 'web',
            password: 'web'
        },
    });
}