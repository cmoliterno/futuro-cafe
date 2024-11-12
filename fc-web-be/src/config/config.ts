import { Dialect } from 'sequelize';

interface DBConfig {
    username: string | undefined;
    password: string | undefined;
    database: string | undefined;
    host: string | undefined;
    dialect: Dialect;
    port: number;
    dialectOptions: {
        options: {
            encrypt: boolean;
            enableArithAbort: boolean;
        };
    };
}

const config: { development: DBConfig; production: DBConfig } = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'mssql',
        port: parseInt(process.env.DB_PORT ?? '3000', 10), // fallback para a porta padrão 1433
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
        port: parseInt(process.env.DB_PORT ?? '3000', 10),
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true
            }
        }
    }
};

export default config;
