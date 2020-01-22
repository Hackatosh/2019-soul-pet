import {
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association
} from 'sequelize';
import {db} from '../connection'
import {Animal} from "./animal";
import {EventComment} from "./eventComment";

/***
 * Model used to represent an user in DB.
 ***/

export class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public hashedPassword!: string;

    public getAnimals!: HasManyGetAssociationsMixin<Animal>;
    public addAnimal!: HasManyAddAssociationMixin<Animal, number>;
    public hasAnimal!: HasManyHasAssociationMixin<Animal, number>;
    public countAnimals!: HasManyCountAssociationsMixin;
    public createAnimal!: HasManyCreateAssociationMixin<Animal>;

    public getComments!: HasManyGetAssociationsMixin<EventComment>;
    public addComment!: HasManyAddAssociationMixin<EventComment, number>;
    public hasComment!: HasManyHasAssociationMixin<EventComment, number>;
    public countComments!: HasManyCountAssociationsMixin;
    public createComment!: HasManyCreateAssociationMixin<EventComment>;

    // These will only be populated if you actively include a relation.
    public readonly animals?: Animal[];
    public readonly eventComments?: EventComment[];

    public static associations: {
        animals: Association<User, Animal>;
        eventComments: Association<User, EventComment>
    };
}

/***
 * Function used to initialize the User Model.
 ***/

const initUserModel = async function():Promise<void> {

    User.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        email: {
            type: new DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        hashedPassword: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
    }, {
        tableName: 'users',
        modelName: 'user',
        timestamps: false,
        sequelize: db,
    });

};

export {initUserModel}