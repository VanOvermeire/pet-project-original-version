const { PETS_ID } = require('../config');

class DbProperties {
    constructor(request) {
        const { id, clientId } = request.params;
        const { name, age, cuteness, type } = request.body ? request.body : {};
        Object.assign(this, { id, clientId, name, age, cuteness, type });
        this.typeId = PETS_ID;
    }

    get item() {
        const { id, clientId, name, age, cuteness, type } = this;
        return { id, clientId, name, age, cuteness, type };
    }

    get ppId() {
        return `${this.typeId}#${this.clientId}`;
    }

    get psId() {
        return this.id;
    }

    clone() {
        return Object.create(
            Object.getPrototypeOf(this),
            Object.getOwnPropertyDescriptors(this),
        );
    }
}

module.exports = {
    DbProperties,
};
