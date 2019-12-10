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
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: false,
        },
        beginDate: {
            type: new DataTypes.DATE,
            allowNull: false,
            unique: false,
        },
        endDate: {
            type: new DataTypes.DATE,
            allowNull: false,
            unique: false,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            unique:false,
        },
        location: {
            type: new DataTypes.STRING(128),
            allowNull: true,
            unique: false,
        },
        description: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: false,
        },
    }, {
        tableName: 'events',
        modelName: 'event',
        sequelize: db,
    });
};

export {initPetEventModel}