import {Sequelize} from 'sequelize';
import {env} from '../config/env'
import {initModelUser} from "./models/user";

const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    dialect: 'mariadb',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    dialectOptions: {
        timezone: 'Etc/GMT0'
    }
});

const initDB = async function(){
    await initModelUser();
};

export { db, initDB }