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

function initItemCounter({ ppCountId, psCountId }) {
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
        // counter already exists
    });
}

async function updateCounter(properties) {
    await initItemCounter(properties);
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: properties.ppCountId,
            psId: properties.psCountId,
        },
        UpdateExpression: 'Set itemCount = itemCount + :incr',
        ExpressionAttributeValues: {
            ':incr': 1,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return dynamoUpdate(params);
}

function getCounter(properties) {
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: properties.ppCountId,
            psId: properties.psCountId,
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

function _get(properties) {
    const params = {
        TableName: DDB_TABLE,
        Key: {
            ppId: properties.ppId,
            psId: properties.psId,
        },
    };
    return dynamoGet(params)
        .then(data => {
            if (data.Item) return { item: data.Item };
        });
}

async function _getWithCounter(properties) {
    return Promise.all([
        _get(properties),
        getCounter(properties),
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

function getItem(properties) {
    if (properties.getCounter) return _getWithCounter(properties);
    return _get(properties);
}

function _put(properties) {
    const { ppId, psId, item } = properties;
    Object.assign(item, { ppId, psId });
    const dynamoDbParams = {
        TableName: DDB_TABLE,
        Item: item,
    };
    return dynamoPut(dynamoDbParams);
}

function _putWithCounter(properties) {
    return _put(properties)
        .then(() => updateCounter(properties));
}

function putItem(properties) {
    if (properties.updateCounter) return _putWithCounter(properties);
    return _put(properties);
}

module.exports = {
    getItem,
    putItem,
};
