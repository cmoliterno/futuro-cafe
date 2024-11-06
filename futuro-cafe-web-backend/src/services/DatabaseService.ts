import { Sequelize } from 'sequelize';
const dbConfig = require(`${__dirname}/../config/config.js`)['production']; 

export const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: false,
        dialectOptions: dbConfig.dialectOptions,
    }
);

export class DatabaseService {
    public getSequelizeInstance(): Sequelize {
        return sequelize;
    }

    public async syncDatabase(): Promise<void> {
        try {
            await sequelize.sync({ force: false });
            console.log('Banco de dados sincronizado com sucesso');
        } catch (error) {
            console.error('Erro ao sincronizar o banco de dados:', error);
        }
    }

    public async testConnection(): Promise<void> {
        try {
            await sequelize.authenticate();
            console.log('Conexão com o banco de dados foi estabelecida com sucesso');
        } catch (error) {
            console.error('Erro ao conectar com o banco de dados:', error);
        }
    }
}
