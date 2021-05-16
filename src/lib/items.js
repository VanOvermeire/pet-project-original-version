const ddb = require('./dynamoDb');

function returnServerError(e, response) {
    console.error(e);
    return response.status(500).send({});
}

async function getItem(request, response, properties) {
    await ddb.getItem(properties)
        .then(data => {
            if (data && data.item) {
                return response.status(200).send(data.item);
            }
            return response.status(404).send({});
        })
        .catch(e => returnServerError(e, response));
}

async function postItem(request, response, properties) {
    await ddb.putItem(properties)
        .then(() => response.status(201))
        .catch(e => returnServerError(e, response));
}

function callFor(Properties) {
    return {
        get(request, response) {
            return getItem(request, response, new Properties(request));
        },
        post(request, response) {
            return postItem(request, response, new Properties(request));
        },
    };
}

module.exports = {
    callFor,
};
