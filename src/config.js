const CONSTANTS = {
    PETS_ID: 'P',
    WILD_ANIMALS_ID: 'W',
    COUNTER_ID: 'C',
};

module.exports = {
    ...CONSTANTS,
    DDB_TABLE: process.env.DATABASE_NAME,
};
