import {
    DataTypes,
    Model
} from "sequelize";
import {db} from "../connection";

export class AnimalPicture extends Model {
    public id!: number;
    public animalId !: number;
    public filename  !: string;
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
        }, {
            tableName: 'animalPictures',
            modelName: 'animalPicture',
            sequelize: db,
        });
    };

export {initAnimalPicturesModel}


