const Datastore = require('nedb');

const db = new Datastore({ filename: './src/items.db', autoload: true });

module.exports = db;
