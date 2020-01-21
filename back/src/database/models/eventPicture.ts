import {
    DataTypes,
    Model
} from "sequelize";
import {db} from "../connection";
import {ContentType} from "../../core/files/ftp";

/***
 * Model used to represent a picture related to an animal in the DB.
 * The filename is used to interact with the SFTP server.
 * The contentType is used to provide correct headers when sending the picture through HTTP response.
 ***/

export class EventPicture extends Model {
    public id!: number;
    public eventId !: number;
    public filename  !: string;
    public contentType !: ContentType;
}

/***
 * Function used to initialize the AnimalPicture Model.
 ***/

const initEventPicturesModel = async function (): Promise<void> {

    EventPicture.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: false,
        },
        filename: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        contentType: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: false,
        },
    }, {
        tableName: 'animalPictures',
        modelName: 'animalPicture',
        sequelize: db,
    });
};

export {initAnimalPicturesModel}


