const { bodyValidation, queryParamValidation } = require('./lib/helpers');
const { callFor } = require('./lib/items');
const { Pet } = require('./lib/pets');
const { WildAnimal } = require('./lib/wildAnimals');

function routesToMapOfPathsWithAvailableMethods(currentRoutes) {
    const optionRoutes = {};
    currentRoutes.forEach((route) => {
        (optionRoutes[route[1]] = optionRoutes[route[1]] || []).push(route[0]);
    });
    return optionRoutes;
}

function generateOptionCalls(api) {
    const currentRoutes = api.routes();
    const optionRoutes = routesToMapOfPathsWithAvailableMethods(currentRoutes);

    Object.keys(optionRoutes).forEach((key) => {
        api.options(key, (request, response) => {
            response.header(
                'Access-Control-Allow-Methods',
                `${optionRoutes[key].join(',')},OPTIONS`,
            );
            response.sendStatus(200);
        });
    });
}

function apply(api) {
    const pets = callFor(Pet);
    const wild = callFor(WildAnimal);

    api.use(queryParamValidation);
    api.use(bodyValidation);

    api.get('/pets/:id/client/:clientId', pets.get);
    api.post('/pets/:id/client/:clientId', pets.post);
    api.get('/wild/:id/type/:type', wild.get);
    api.post('/wild/:id/type/:type', wild.post);

    generateOptionCalls(api);
}

module.exports = { apply };
