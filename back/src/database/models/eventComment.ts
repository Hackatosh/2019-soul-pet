import {
    Model,
    DataTypes,
} from 'sequelize';
import {db} from '../connection'
import {User} from "./user";

/***
 * Model used to represent an comment made by a user about an event in the DB.
 ***/

export class EventComment extends Model {
    public id!: number;
    public userId!: number;
    public eventId!: number;
    public text!: string;

    // These will only be populated if you actively include a relation.
    public readonly user?: User;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/***
 * Function used to initialize the EventComment Model.
 ***/

const initEventCommentModel = async function (): Promise<void> {

    EventComment.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        eventId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        text: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: false,
        },
    }, {
        tableName: 'eventComments',
        modelName: 'eventComment',
        timestamps: true,
        sequelize: db,
    });
};

export {initEventCommentModel}