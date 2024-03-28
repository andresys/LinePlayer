/*
W3C def language codes is :
    language-code = primary-code ( "-" subcode )
        primary-code    ISO 639-1   ( the names of language with 2 code )
        subcode         ISO 3166    ( the names of countries )

NOTE: use lowercase to prevent case typo from user!
Use this as shown below..... */

module.exports = function (lang) {
    this.lang = lang;
    this.tran = (text) => {
        if (tranTxt[this.lang] && tranTxt[this.lang][text]) {
            return tranTxt[this.lang][text];
        }
        else {
            return text;
        }
    };
};

// add translation text here
const tranTxt = {
    'ru' : {
        'LinePlayer is loading': 'LinePlayer загружается',
        'About LinePlayer': 'О LinePlayer',
        'This video fails to load': 'Ошибка загрузки видео',
        'Full screen': 'Во весь экран',
        'Screenshot': 'Скриншот',
        'Volume': 'Громкость',
        'Live': 'В эфире',
        'Play' : 'Возпроизвести',
        'Pause' : 'Пауза',
        'Prev' : 'Предыдущее',
        'Next' : 'Следующее',
        'Quality change' : 'Сменить качество видео'
    }
};