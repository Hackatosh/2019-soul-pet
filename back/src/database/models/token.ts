import {Model, DataTypes} from 'sequelize';
import {db} from '../connection'

/*** Model used to represent a token in DB ***/
export class Token extends Model {
    public token!: number; // Note that the `null assertion` `!` is required in strict mode.
    public userId!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

const initTokenModel = async function():Promise<void> {

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
        sequelize: db,
    });

    await Token.sync();
};

export { initTokenModel }