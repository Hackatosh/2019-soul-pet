import {
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    Association,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";
import {Specie} from "./specie";

/*** Model used to represent an event in DB ***/
export class PetEvent extends Model {
    public id!: number;
    public name!: string;
    public beginDate!: Date;
    public endDate!: Date;
    public userId: number;
    public location: string;
    public description!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getAttendees!: BelongsToManyGetAssociationsMixin<Animal>;
    public addAttendee!: BelongsToManyAddAssociationMixin<Animal, number>;
    public addAttendees!: BelongsToManyAddAssociationsMixin<Animal, number>;
    public setAttendees!: BelongsToManySetAssociationsMixin<Animal, number>;
    public removeAttendee!:BelongsToManyRemoveAssociationMixin<Animal,number>;
    public removeAttendees!:BelongsToManyRemoveAssociationsMixin<Animal,number>;

    // These will only be populated if you actively include a relation.
    public readonly attendees?: Animal[];

    public getAuthorizedSpecies!: BelongsToManyGetAssociationsMixin<Specie>;
    public addAuthorizedSpecie!: BelongsToManyAddAssociationMixin<Specie, number>;
    public addAuthorizedSpecies!: BelongsToManyAddAssociationsMixin<Specie, number>;
    public setAuthorizedSpecies!: BelongsToManySetAssociationsMixin<Specie, number>;
    public removeAuthorizedSpecie!:BelongsToManyRemoveAssociationMixin<Specie,number>;
    public removeAuthorizedSpecies!:BelongsToManyRemoveAssociationsMixin<Specie,number>;

    // These will only be populated if you actively include a relation.
    public readonly authorizedSpecies?: Specie[];

    public static associations: {
        attendees: Association<Animal, PetEvent>;
        authorizedSpecies: Association<Specie, PetEvent>;
    };

}

/*** Function used to initialize the PetEvent Model ***/
const initPetEventModel = async function():Promise<void> {

    PetEvent.init({
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

export {initPetEventModel}