require('dotenv').config(); // Carrega as variáveis de ambiente do .env

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mssql',
        port: parseInt(process.env.DB_PORT, 10),
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true
            }
        }
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mssql',
        port: parseInt(process.env.DB_PORT, 10),
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true
            }
        }
    }
};
