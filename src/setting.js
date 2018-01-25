import utils from './utils';

class Setting {
    constructor (player) {
        this.player = player;

        this.player.template.mask.addEventListener('click', () => {
            this.hide();
        });
    }

    hide () {
        this.player.template.mask.classList.remove('lineplayer-mask-show');
        this.player.controller.disableAutoHide = false;
    }

    show () {
        this.player.template.mask.classList.add('lineplayer-mask-show');
        this.player.controller.disableAutoHide = true;
    }
}

module.exports = Setting;