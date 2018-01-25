// stats.js: JavaScript Performance Monitor
initPlayers();

function initPlayers () {
    // lineplayer
    window.lineplayer = new LinePlayer({
        container: document.getElementById('lineplayer'),
        lang: 'ru-ru',
        autoplay: true,
        volume: false,
        logo: 'gerb.png',
        screenshot: true,
        line: {
            host: 'line.adm.tver.ru',
            user: 'web',
            password: 'web'
        }
    });
}