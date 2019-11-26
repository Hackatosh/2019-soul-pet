import {Sequelize} from 'sequelize';
import {env} from '../config/env'

const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    dialect: 'mariadb',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export { db }