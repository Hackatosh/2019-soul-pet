import {Model, DataTypes} from 'sequelize';
import {db} from '../connection'

/***
 * Model used to represent a token in DB.
 ***/

export class Token extends Model {
    public token!: number;
    public userId!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/***
 * Function used to initialize the Token Model.
 ***/

const initTokenModel = async function (): Promise<void> {
    Token.init({
        token: {
            type: DataTypes.STRING(128),
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    }, {
        tableName: 'tokens',
        modelName: 'token',
        sequelize: db,
    });
};

export {initTokenModel}