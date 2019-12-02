/*** This file set up the DB using Sequelize***/

import {Sequelize} from 'sequelize';
import {env} from '../config/env'

/*** Create a Sequelize instance which holds all the informations to connect to MariaDB ***/
const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    dialect: 'mariadb',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    dialectOptions: {
        timezone: 'Etc/GMT0',
    },
});

export { db }