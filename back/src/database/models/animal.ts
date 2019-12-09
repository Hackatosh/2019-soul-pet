import {
    Model,
    DataTypes,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    Association,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin
} from 'sequelize';
import {db} from '../connection'
import {Specie} from "./specie";
import {PetEvent} from "./event";

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

    public getEvents!: BelongsToManyGetAssociationsMixin<PetEvent>;
    public addEvent!: BelongsToManyAddAssociationMixin<PetEvent, number>;
    public addEvents!: BelongsToManyAddAssociationsMixin<PetEvent, number>;
    public setEvents!: BelongsToManySetAssociationsMixin<PetEvent, number>;
    public removeEvent!:BelongsToManyRemoveAssociationMixin<PetEvent,number>;
    public removeEvents!:BelongsToManyRemoveAssociationsMixin<PetEvent,number>;

    // These will only be populated if you actively include a relation.
    public readonly events?: PetEvent[];

    public static associations: {
        events: Association<PetEvent,Animal>;
    }
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
};

export {initAnimalModel}