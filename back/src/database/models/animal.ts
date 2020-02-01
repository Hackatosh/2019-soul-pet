import {
    Model,
    DataTypes,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    Association,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin
} from 'sequelize';
import {db} from '../connection'
import {PetEvent} from "./event";
import {AnimalPicture} from "./animalPicture";

/***
 * Model used to represent an animal in the DB.
 ***/

export class Animal extends Model {
    public id!: number;
    public userId!: number;
    public specieId!: number;
    public birthdate!: Date;
    public name!: string;

    public getEvents!: BelongsToManyGetAssociationsMixin<PetEvent>;
    public addEvent!: BelongsToManyAddAssociationMixin<PetEvent, number>;
    public addEvents!: BelongsToManyAddAssociationsMixin<PetEvent, number>;
    public setEvents!: BelongsToManySetAssociationsMixin<PetEvent, number>;
    public removeEvent!: BelongsToManyRemoveAssociationMixin<PetEvent, number>;
    public removeEvents!: BelongsToManyRemoveAssociationsMixin<PetEvent, number>;

    public getAnimalPictures!: HasManyGetAssociationsMixin<AnimalPicture>;
    public addAnimalPicture!: HasManyAddAssociationMixin<AnimalPicture, number>;
    public hasAnimalPicture!: HasManyHasAssociationMixin<AnimalPicture, number>;
    public countAnimalPictures!: HasManyCountAssociationsMixin;
    public createAnimalPictures!: HasManyCreateAssociationMixin<AnimalPicture>;
    public removeAnimalPicture !: HasManyHasAssociationMixin<AnimalPicture, number>;
    public removeAnimalPictures !: HasManyHasAssociationMixin<AnimalPicture, number>;

    // These will only be populated if you actively include a relation.
    public readonly events?: PetEvent[];
    public readonly animalPictures?: AnimalPicture[];

    public static associations: {
        events: Association<Animal, PetEvent>;
        pictures: Association<AnimalPicture, Animal>;
    }
}

/***
 * Function used to initialize the Animal Model.
 ***/

const initAnimalModel = async function (): Promise<void> {
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
        timestamps: false,
        sequelize: db,
    });
};

export {initAnimalModel}
