import {
    Model,
    DataTypes,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    Association,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";
import {Specie} from "./specie";
import {EventComment} from "./eventComment";

/***
 * Model used to represent an event in the DB.
 * IMPORTANT : Please note that the name Event already refers to a standard class in NodeJS, that's why its use is avoided here.
 ***/

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
    public removeAttendee!: BelongsToManyRemoveAssociationMixin<Animal, number>;
    public removeAttendees!: BelongsToManyRemoveAssociationsMixin<Animal, number>;

    public getAuthorizedSpecies!: BelongsToManyGetAssociationsMixin<Specie>;
    public addAuthorizedSpecie!: BelongsToManyAddAssociationMixin<Specie, number>;
    public addAuthorizedSpecies!: BelongsToManyAddAssociationsMixin<Specie, number>;
    public setAuthorizedSpecies!: BelongsToManySetAssociationsMixin<Specie, number>;
    public removeAuthorizedSpecie!: BelongsToManyRemoveAssociationMixin<Specie, number>;
    public removeAuthorizedSpecies!: BelongsToManyRemoveAssociationsMixin<Specie, number>;

    public getComments!: HasManyGetAssociationsMixin<EventComment>; // Note the null assertions!
    public addComment!: HasManyAddAssociationMixin<EventComment, number>;
    public hasComment!: HasManyHasAssociationMixin<EventComment, number>;
    public countComments!: HasManyCountAssociationsMixin;
    public createComment!: HasManyCreateAssociationMixin<EventComment>;

    // These will only be populated if you actively include a relation.
    public readonly attendees?: Animal[];
    public readonly authorizedSpecies?: Specie[];
    public readonly comments?: EventComment[];

    public static associations: {
        attendees: Association<PetEvent, Animal>;
        authorizedSpecies: Association<PetEvent, Specie>;
        comments: Association<PetEvent, EventComment>
    };

}

/***
 * Function used to initialize the PetEvent Model.
 ***/

const initPetEventModel = async function (): Promise<void> {

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
            unique: false,
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