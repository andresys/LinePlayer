class Bezel {
    constructor (container) {
        this.container = container;

        this.container.addEventListener('animationend', () => {
            this.container.classList.remove('lineplayer-bezel-transition');
        });
    }

    switch (icon) {
        this.container.innerHTML = icon;
        this.container.classList.add('lineplayer-bezel-transition');
    }
}

module.exports = Bezel;