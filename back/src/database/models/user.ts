import {Model, DataTypes} from 'sequelize';
import {db} from '../connection'

export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public username!: string;
    public email!: string;
    public hashedPassword!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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

User.sync();
