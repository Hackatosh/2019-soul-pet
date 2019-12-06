import {Model, DataTypes} from 'sequelize';
import {db} from '../connection'

/*** Model used to represent an animal in DB ***/
export class Animal extends Model {
    public id!: number;
    public userId!: number;
    public specieId!: number;
    public birthdate!: Date;
    public name!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/*** Function used to initialize the User Model ***/
const initAnimalModel = async function():Promise<void> {

    Animal.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        specieId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        birthdate: {
            type: new DataTypes.DATE,
            allowNull: false,
            unique: false,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: false,
        },
    }, {
        tableName: 'animals',
        modelName: 'animal',
        sequelize: db,
    });
    await Animal.sync();
};

export {initAnimalModel}