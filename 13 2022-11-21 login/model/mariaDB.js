//npm install knex mysql
//npm install knex sqlite3

const options = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'ecommerceProd'
    },
};

module.exports = { options };