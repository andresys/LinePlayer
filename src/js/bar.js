class Bar {
    constructor (player) {
        this.player = player;

        this.elements = {};
    }

    add (type, bar) {
        this.elements[type] = bar;   
    }

    /**
     * Update progress
     *
     * @param {String} type - Point out which bar it is
     * @param {Number} percentage
     * @param {String} direction - Point out the direction of this bar, Should be height or width
     */
    set (type, percentage, direction) {
        percentage = Math.max(percentage, 0);
        percentage = Math.min(percentage, 1);
        this.elements[type].style[direction] = percentage * 100 + '%';
    }

    get (type) {
        return parseFloat(this.elements[type].style.width) / 100;
    }
}

module.exports = Bar;