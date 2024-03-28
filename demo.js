// stats.js: JavaScript Performance Monitor
initPlayers();

function initPlayers () {
    // lineplayer
    window.lineplayer = new LinePlayer({
        container: document.getElementById('lineplayer'),
        volume: false,
        screenshot: true,
        autoplay: true,
        title: 'Видео',
        hls: 'https://video.adm.tver.ru/hls/27aec28e-6181-4753-9acd-0456a75f0289/0/index.m3u8'
    });
}
