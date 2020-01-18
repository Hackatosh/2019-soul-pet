import {
    DataTypes,
    Model
} from "sequelize";
import {db} from "../connection";
import {ContentType} from "../../core/files/ftp";

export class AnimalPicture extends Model {
    public id!: number;
    public animalId !: number;
    public filename  !: string;
    public contentType !: ContentType;
}

    const initAnimalPicturesModel = async function():Promise<void> {

        AnimalPicture.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            animalId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: false,
            },
            filename: {
                type :new DataTypes.STRING(128),
                allowNull : false,
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


