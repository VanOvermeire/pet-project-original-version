const api = require('lambda-api')({
    logger: {
        level: 'debug',
        access: true,
        stack: true,
        serializers: {
            req: (req) => ({
                query: req.query,
                params: req.params,
            }),
        },
    },
});
const routes = require('./routing');

routes.apply(api);

exports.handler = async (event, context) => {
    console.log(event);
    if(event.version === "2.0") { // TODO temp - bug in library...
        event.httpMethod = event.requestContext.http.method;
        event.path = event.requestContext.http.path;
    }
    return api.run(event, context);
};
