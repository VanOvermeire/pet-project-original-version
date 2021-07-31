const AWS = require('aws-sdk');
const { DDB_TABLE } = require('../config');

const docClient = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

async function dynamoGet(params) {
    return docClient.get(params).promise();
}

async function dynamoPut(params) {
    return docClient.put(params).promise();
}

async function dynamoUpdate(params) {
    return docClient.update(params).promise();
}

function initCounter({ ppCountId, psCountId }) {
    const dynamoDbParams = {
        TableName: DDB_TABLE,
        Item: {
            ppId: ppCountId,
            psId: psCountId,
            itemCount: 0,
        },
        ConditionExpression: 'attribute_not_exists(itemCount)',
    };
    return dynamoPut(dynamoDbParams).catch(() => {
        // error if the counter already exists
    });
}

async function updateCounter(animal) {
    await initCounter(animal);
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: animal.ppCountId,
            psId: animal.psCountId,
        },
        UpdateExpression: 'Set itemCount = itemCount + :incr',
        ExpressionAttributeValues: {
            ':incr': 1,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return dynamoUpdate(params);
}

function getCounter(animal) {
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: animal.ppCountId,
            psId: animal.psCountId,
        },
    };
    return dynamoGet(params)
        .then(data => {
            if (data.Item) {
                return data.Item.itemCount;
            }
            return 0;
        });
}

function get(animal) {
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: animal.ppId,
            psId: animal.psId,
        },
    };
    return dynamoGet(params)
        .then(data => {
            if (data.Item) return { item: data.Item };
        });
}

async function getWithCounter(animal) {
    return Promise.all([
        get(animal),
        getCounter(animal),
    ])
        .then(data => {
            if (data[0]) {
                return {
                    item: {
                        ...data[0].item,
                        count: data[1],
                    },
                };
            }
        });
}

function put(animal) {
    const { ppId, psId, item } = animal;
    Object.assign(item, { ppId, psId });
    const dynamoDbParams = {
        TableName: DDB_TABLE,
        Item: item,
    };
    return dynamoPut(dynamoDbParams);
}

function putWithCounter(animal) {
    return put(animal)
        .then(() => updateCounter(animal));
}

function getItem(animal) {
    if (animal.getCounter) return getWithCounter(animal);
    return get(animal);
}

function putItem(animal) {
    if (animal.updateCounter) return putWithCounter(animal);
    return put(animal);
}

module.exports = {
    getItem,
    putItem,
};
