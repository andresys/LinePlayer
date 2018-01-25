<h1 align="center">LinePlayer</h1>

> HTML5 video player for devline server

Based on [DPlayer](https://github.com/MoePlayer/DPlayer) source code

**[Demo](http://lineplayer.js.org/)**

## Quick Start

```html
<link rel="stylesheet" href="LinePlayer.min.css">
<div id="lineplayer"></div>
<script src="//cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"></script>
<script src="LinePlayer.min.js"></script>
```

```js
new LinePlayer({
    container: document.getElementById('lineplayer'),
    volume: false,
    screenshot: true,
    line: {
        host: 'line.adm.tver.ru',
        user: 'web',
        password: 'web'
    }
});
```

## Author

**LinePlayer** © [andresys](https://github.com/andresys), Released under the [MIT](./LICENSE) License.