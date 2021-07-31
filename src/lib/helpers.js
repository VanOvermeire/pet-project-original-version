function validateString(value) {
    if (!value.trim()) throw new Error('Received an empty value');
}

function validateObject(obj) {
    if (typeof obj === 'undefined') return;
    if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            validateString(key);
            const type = typeof obj[key];

            if (type === 'function') {
                throw new Error('No functions allowed');
            }
        });
    }
}

function bodyValidation(request, response, next) {
    if (!request.body && request.method !== 'POST') {
        next();
    } else {
        try {
            validateObject(request.body);
            next();
        } catch (e) {
            console.error(`body validation error: ${e}`);
            return response.sendStatus(400);
        }
    }
}

function queryParamValidation(request, response, next) {
    if (!request.query) {
        next();
    } else {
        try {
            Object.keys(request.query).forEach(key => {
                validateString(key);
                validateString(String(request.query[key]));
            });
            next();
        } catch (e) {
            console.log(`query parameters validation error: ${e}`);
            return response.sendStatus(400);
        }
    }
}

module.exports = {
    bodyValidation,
    queryParamValidation,
};
