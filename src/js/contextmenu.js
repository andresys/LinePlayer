class ContextMenu {
    constructor (player) {
        this.player = player;

        this.player.container.addEventListener('contextmenu', (e) => {
            const event = e || window.event;
            event.preventDefault();

            const clientRect = this.player.container.getBoundingClientRect();
            this.show(event.clientX - clientRect.left, event.clientY - clientRect.top);

            this.player.template.mask.addEventListener('click', () => {
                this.hide();
            });
        });
    }

    show (x, y) {
        this.player.template.menu.classList.add('lineplayer-menu-show');

        const clientRect = this.player.container.getBoundingClientRect();
        if (x + this.player.template.menu.offsetWidth >= clientRect.width) {
            this.player.template.menu.style.right = clientRect.width - x + 'px';
            this.player.template.menu.style.left = 'initial';
        }
        else {
            this.player.template.menu.style.left = x + 'px';
            this.player.template.menu.style.right = 'initial';
        }
        if (y + this.player.template.menu.offsetHeight >= clientRect.height) {
            this.player.template.menu.style.bottom = clientRect.height - y + 'px';
            this.player.template.menu.style.top = 'initial';
        }
        else {
            this.player.template.menu.style.top = y + 'px';
            this.player.template.menu.style.bottom = 'initial';
        }

        this.player.template.mask.classList.add('lineplayer-mask-show');

        this.player.events.trigger('contextmenu_show');
    }

    hide () {
        this.player.template.mask.classList.remove('lineplayer-mask-show');
        this.player.template.menu.classList.remove('lineplayer-menu-show');

        this.player.events.trigger('contextmenu_hide');
    }
}

module.exports = ContextMenu;