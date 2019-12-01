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

Token.init({
    token: {
        type: DataTypes.STRING(128),
        primaryKey: true,
    },
    userId: {
        type: new DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: 'tokens',
    sequelize: db,
});

Token.sync();