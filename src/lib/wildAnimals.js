const { WILD_ANIMALS_ID, COUNTER_ID } = require('../config');

class WildAnimal {
    constructor(request) {
        const { id, type } = request.params;
        const { age } = request.body ? request.body : {};
        Object.assign(this, { id, age, type });
        this.updateCounter = true;
        this.getCounter = true;
        this.typeId = WILD_ANIMALS_ID;
    }

    get item() {
        const { id, age, type } = this;
        return { id, age, type };
    }

    get ppId() {
        return `${this.typeId}#${this.type}`;
    }

    get psId() {
        return `${this.id}`;
    }

    get ppCountId() {
        return `${this.typeId}#${COUNTER_ID}`;
    }

    get psCountId() {
        return this.type;
    }
}

module.exports = {
    WildAnimal,
};
