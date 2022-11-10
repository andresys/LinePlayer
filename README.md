<h1>LinePlayer</h1>

> HTML5 player for video servers
> Supported servers:
> * Line (https://devline.ru/)
> * Domination (https://domination.one/)

Based on [DPlayer](https://github.com/MoePlayer/DPlayer) source code

**[Web site](https://andresys.github.io/LinePlayer/)**

## Quick Start

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/lineplayer/dist/LinePlayer.min.css">
<div id="lineplayer"></div>
<script src="//cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/lineplayer/dist/LinePlayer.min.js"></script>
```

```js
new LinePlayer({
    container: document.getElementById('lineplayer'),
    line: {
        host: 'line.adm.tver.ru',
        user: 'web',
        password: 'web',
        channels: ['0', 'Площадь Ленина']
    }
});
```

or

```js
new LinePlayer({
    container: document.getElementById('lineplayer'),
    domination: {
        host: 'line.adm.tver.ru',
        user: 'web',
        password: 'web',
        channels: 'Площадь Ленина'
    }
});
```


## Author

**LinePlayer** © [andresys](https://github.com/andresys), Released under the [MIT](./LICENSE) License.