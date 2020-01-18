import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, Op
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
    const species: Array<{ id: number, name: string }> = [
        {id: 1, name: "Chien"},
        {id: 2, name: "Lama"},
        {id: 3, name: "Chat"},
        {id: 4, name: "Lapin"},
        {id: 5, name: "Perroquet"},
        {id: 6, name: "Loutre"},
    ];
    const addSpecie = async function(specie:{id:number,name:string}):Promise<void>{
        const specieFound = await Specie.findOne({where: {[Op.or]: [{id:specie.id},{name:specie.name}]}});
        if(!specieFound)
            await Specie.create(specie);
    };
    const promises:Array<Promise<void>> = species.map(specie => addSpecie(specie));
    await Promise.all(promises);
};

export {initSpecieModel, specieModelFill}