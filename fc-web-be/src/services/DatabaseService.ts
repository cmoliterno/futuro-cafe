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
        logging: true,
        dialectOptions: {
            ...dbConfig.dialectOptions,
            useUTC: false, // Não usar UTC por padrão
            timezone: '-03:00' // Configuração para Brasil (BRT)
        },
        timezone: '-03:00', // Define o timezone para uso da aplicação
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
