import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";

/*** Model used to represent a user in DB ***/
export class User extends Model {
    public id!: number; // Note that the `null assertion` `!` is required in strict mode.
    public username!: string;
    public email!: string;
    public hashedPassword!: string;

    public getAnimals!: HasManyGetAssociationsMixin<Animal>; // Note the null assertions!
    public addAnimal!: HasManyAddAssociationMixin<Animal, number>;
    public hasAnimal!: HasManyHasAssociationMixin<Animal, number>;
    public countAnimals!: HasManyCountAssociationsMixin;
    public createAnimal!: HasManyCreateAssociationMixin<Animal>;

    // These will only be populated if you actively include a relation.
    public readonly animals?: Animal[];

    public static associations: {
        animals: Association<User, Animal>;
    };

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
        modelName: 'user',
        sequelize: db,
    });

};

export {initUserModel}