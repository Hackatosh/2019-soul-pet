import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Association
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";

/*** Model used to represent a specie in DB ***/
export class Specie extends Model {
    public id!: number;
    public name!: string;

    public getAnimals!: HasManyGetAssociationsMixin<Animal>; // Note the null assertions!
    public addAnimal!: HasManyAddAssociationMixin<Animal, number>;
    public hasAnimal!: HasManyHasAssociationMixin<Animal, number>;
    public countAnimals!: HasManyCountAssociationsMixin;
    public createAnimal!: HasManyCreateAssociationMixin<Animal>;

    // These will only be populated if you actively include a relation.
    public readonly animals?: Animal[];

    public static associations: {
        animals: Association<Specie, Animal>;
    };

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/*** Function used to initialize the User Model ***/
const initSpecieModel = async function():Promise<void> {

    Specie.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
    }, {
        tableName: 'species',
        modelName: 'specie',
        sequelize: db,
    });

    await Specie.sync();
};

export {initSpecieModel}