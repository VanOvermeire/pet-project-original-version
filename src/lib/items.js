const ddb = require('./dynamoDb');

function returnServerError(e, response) {
    console.error(e);
    return response.status(500).send({});
}

async function getItem(request, response, animal) {
    await ddb.getItem(animal)
        .then(data => {
            if (data && data.item) {
                return response.status(200).send(data.item);
            }
            return response.status(404).send({});
        })
        .catch(e => returnServerError(e, response));
}

async function postItem(request, response, animal) {
    await ddb.putItem(animal)
        .then(() => response.status(201))
        .catch(e => returnServerError(e, response));
}

function callFor(AnimalClass) {
    return {
        get(request, response) {
            return getItem(request, response, new AnimalClass(request));
        },
        post(request, response) {
            return postItem(request, response, new AnimalClass(request));
        },
    };
}

module.exports = {
    callFor,
};
