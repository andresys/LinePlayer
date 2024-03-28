module.exports = {

    /**
     * control play progress
     */
    // get element's view position
    getElementViewLeft: (element) => {
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;
        const elementScrollLeft = document.body.scrollLeft + document.documentElement.scrollLeft;
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
        }
        else {
            while (current !== null && current !== element) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
        }
        return actualLeft - elementScrollLeft;
    },

    fullHeight: (obj) => {
        var compstyle=(typeof window.getComputedStyle==='undefined') ? obj.currentStyle : window.getComputedStyle(obj);
        var marginTop = parseInt(compstyle.marginTop);
        var marginBottom = parseInt(compstyle.marginBottom);
        var paddingTop = parseInt(compstyle.paddingTop);
        var paddingBottom = parseInt(compstyle.paddingBottom);
        var borderTopWidth = parseInt(compstyle.borderTopWidth);
        var borderBottomWidth = parseInt(compstyle.borderBottomWidth);
        return obj.offsetHeight +
             (isNaN(marginTop) ? 0 : marginTop) + (isNaN(marginBottom) ? 0 : marginBottom) +
             (isNaN(paddingTop) ? 0 : paddingTop) + (isNaN(paddingBottom) ? 0 : paddingBottom) +
             (isNaN(borderTopWidth) ? 0 : borderTopWidth) + (isNaN(borderBottomWidth) ? 0 : borderBottomWidth);
    },

    getScrollPosition () {
        return {
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        };
    },

    setScrollPosition ({left = 0, top = 0}) {
        if (this.isFirefox) {
            document.documentElement.scrollLeft = left;
            document.documentElement.scrollTop = top;
        }
        else {
            window.scrollTo(left, top);
        }
    },

    extendArray (array, extend) {
        for (var key in extend) {
            if (Object.prototype.hasOwnProperty.call(extend, key)) {
                if (typeof array[key] === 'object') {
                    array[key] = this.extendArray(array[key], extend[key]);
                }
                else array[key] = extend[key];
            }
        }
        return array;
    },

    currentDateTime () {
        var now = new Date();
        return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    },

    saveAs (uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;
            //Firefox requires the link to be in the body
            document.body.appendChild(link);
            //simulate click
            link.click();
            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    },

    makevalue (value, index, name = null) {
        if(!value) {
            return name || '';
        }

        if(typeof value === 'string') {
            return value;
        }

        if(typeof value === 'function') {
            return value(name, index);
        }

        if(Array.isArray(value)) {
            return value[index] || name;
        }

        return Object.prototype.hasOwnProperty.call(value, index) ? value[index] : name || '';
    },

    /**
     * check if user is using mobile or not
     */
    isMobile: /mobile/i.test(window.navigator.userAgent),

    isFirefox: /firefox/i.test(window.navigator.userAgent),

    isChrome: /chrome/i.test(window.navigator.userAgent),

    storage: {
        set: (key, value) => {
            localStorage.setItem(key, value);
        },

        get: (key) => localStorage.getItem(key)
    }

};
