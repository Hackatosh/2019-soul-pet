import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";
import {PetEvent} from "./event";

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
}

/*** Function used to initialize the User Model ***/
const initSpecieModel = async function (): Promise<void> {

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
        timestamps: false,
        sequelize: db,
    });

};

const specieModelFill = async function (): Promise<void> {
    await Specie.create({id: 1, name: "Chien"});
    await Specie.create({id: 2, name: "Lama"});
    await Specie.create({id: 3, name: "Chat"});
    await Specie.create({id: 4, name: "Lapin"});
    await Specie.create({id:5, name: "Perroquet"});
    await Specie.create({id:6, name: "Loutre"});
};

export {initSpecieModel, specieModelFill}