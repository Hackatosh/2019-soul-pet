import {Model, DataTypes} from 'sequelize';
import {db} from '../connection'

/*** Model used to represent a user in DB ***/
export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public username!: string;
    public email!: string;
    public hashedPassword!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/*** Function used to initialize the User Model ***/
const initUserModel = async function():Promise<void> {

    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        hashedPassword: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
    }, {
        tableName: 'users',
        sequelize: db,
    });

    await User.sync();
};

export {initUserModel}